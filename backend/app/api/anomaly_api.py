from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ..core.alem_services import get_cloud_compute
from ..models.anomaly import AnomalyRequest, AnomalyResponse
from ..models.alem import FeaturePayload, InferenceRequest

router = APIRouter(prefix="/api", tags=["anomaly"])


STAGE_MAP = {
    "lag": "Lag",
    "log": "Log",
    "stationary": "Stationary",
    "decline": "Decline",
}


def _normalize_stage(raw: str) -> str:
    k = raw.strip().lower()
    if k not in STAGE_MAP:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown stage {raw!r}. Use: lag, log, stationary, decline.",
        )
    return STAGE_MAP[k]


def _split_features(features: list[float]) -> tuple[list[float], list[float]]:
    if len(features) < 77:
        raise HTTPException(
            status_code=400,
            detail="features must be at least 77 values (spectrum + 13 MFCC).",
        )
    mfcc = features[-13:]
    spectrum = features[:-13]
    if len(spectrum) > 256:
        raise HTTPException(status_code=400, detail="spectrum too long (max 256 bins).")
    return spectrum, mfcc


def _risk_to_status(risk: str) -> str:
    if risk == "CRITICAL":
        return "critical"
    if risk == "WARNING":
        return "warning"
    return "normal"


def _diagnostic_ru(*, risk: str, stage_ru: str, score: float) -> str:
    s = round(float(score), 4)
    if risk == "CRITICAL":
        return (
            f"Статус: Critical\n"
            f"Причина: повышенные вибрации в частотном диапазоне (фаза {stage_ru}).\n"
            f"Вероятная причина: кавитация / нестабильная аэрация.\n"
            f"Рекомендация: снизить обороты мешалки и зафиксировать тренд.\n"
            f"Оценка: {s}"
        )
    if risk == "WARNING":
        return (
            f"Статус: Warning\n"
            f"Причина: рост вариации спектра относительно базы для фазы {stage_ru}.\n"
            f"Вероятная причина: переходный режим аэрации или ослабление крепления привода.\n"
            f"Рекомендация: проверить задание аэрации и вибрацию опоры.\n"
            f"Оценка: {s}"
        )
    return (
        f"Статус: Normal\n"
        f"Причина: в пределах ожидаемого контура для фазы {stage_ru}.\n"
        f"Рекомендация: продолжить мониторинг.\n"
        f"Оценка: {s}"
    )


_STAGE_RU = {"Lag": "лаг", "Log": "рост", "Stationary": "стационар", "Decline": "спад"}


@router.post("/anomaly", response_model=AnomalyResponse)
async def anomaly(payload: AnomalyRequest) -> AnomalyResponse:
    stage = _normalize_stage(payload.stage)
    spectrum, mfcc = _split_features(payload.features)

    req = InferenceRequest(
        reactor_id="API",
        stage=stage,  # type: ignore[arg-type]
        stage_hours_in=0.0,
        features=FeaturePayload(
            spectrum=spectrum,
            mfcc=mfcc,
            f_min_hz=2000,
            f_max_hz=12000,
        ),
        privacy={"raw_audio_transmitted": False, "payload": "features_only"},
    )
    out = get_cloud_compute().infer(req)
    risk = str(out.risk_level)
    status = _risk_to_status(risk)
    stage_out = stage.lower()
    ru = _diagnostic_ru(risk=risk, stage_ru=_STAGE_RU.get(stage, stage), score=out.anomaly_score)
    return AnomalyResponse(score=float(out.anomaly_score), stage=stage_out, status=status, diagnostic_ru=ru)

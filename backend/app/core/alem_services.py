from __future__ import annotations

import time

import torch

from stetho_ai.cvae import ConditionalVAE, StageAwareRealtimeInferencer

from ..models.alem import (
    AlemCloudComputeResponse,
    InferenceRequest,
    QazaqLLMResponse,
    SpeechResponse,
    StructuredDiagnostic,
)


class AlemCloudComputeService:
    """Mock adapter for alem.plus Cloud Compute running stage-aware C-VAE inference."""

    def __init__(self) -> None:
        torch.manual_seed(42)
        # x_dim = spectrum bins (140 default) + mfcc (13)
        self._engine = StageAwareRealtimeInferencer(
            ConditionalVAE(x_dim=153, c_dim=4, z_dim=16, hidden=(256, 128), dropout=0.0),
            beta=0.2,
        )

    def infer(self, payload: InferenceRequest) -> AlemCloudComputeResponse:
        t0 = time.perf_counter()
        out = self._engine.infer_features(
            spectrum=payload.features.spectrum,
            mfcc=payload.features.mfcc,
            stage=payload.stage,
        )
        latency = int((time.perf_counter() - t0) * 1000)
        return AlemCloudComputeResponse(
            anomaly_score=float(out["anomaly_score"]),
            recon_error=float(out["recon_error"]),
            kl_div=float(out["kl_div"]),
            risk_level=str(out["risk_level"]),
            confidence=int(out["confidence"]),
            thresholds=dict(out["thresholds"]),
            latency_ms=max(8, latency),
        )


class QazaqLLMService:
    """Mock adapter for Qazaq LLM API to convert scores into operator-ready reports."""

    @staticmethod
    def _structured(
        *,
        stage: str,
        stage_hours_in: float,
        anomaly_score: float,
        risk_level: str,
    ) -> StructuredDiagnostic:
        """
        Deterministic templates keyed by (stage, risk_level) only — same inputs => same copy.
        """
        s = round(float(anomaly_score), 5)
        if risk_level == "CRITICAL":
            return StructuredDiagnostic(
                observations=(
                    f"Повышенная ВЧ-активность относительно базы для фазы {stage} ({stage_hours_in:.1f} ч). "
                    f"Оценка {s} выше критического порога."
                ),
                root_cause_hypothesis="Вероятна кавитация рабочего колеса или нестабильная аэрация.",
                recommended_action="Снизить обороты мешалки на 5%, наблюдать 10 минут; при сохранении — эскалация.",
            )
        if risk_level == "WARNING":
            return StructuredDiagnostic(
                observations=(
                    f"Рост вариации спектра в фазе {stage} ({stage_hours_in:.1f} ч); оценка {s} выше предупреждения."
                ),
                root_cause_hypothesis="Возможен переходный режим аэрации или ослабление крепления привода.",
                recommended_action="Проверить задание аэрации и вибрацию опоры; продолжить мониторинг.",
            )
        return StructuredDiagnostic(
            observations=(
                f"Контур в норме для фазы {stage} ({stage_hours_in:.1f} ч); оценка {s} в допустимой зоне."
            ),
            root_cause_hypothesis="Отклонений по C-VAE в текущих условиях не выявлено.",
            recommended_action="Продолжить наблюдение; изменений по акустическому каналу не требуется.",
        )

    @staticmethod
    def report(*, stage: str, stage_hours_in: float, anomaly_score: float, risk_level: str) -> QazaqLLMResponse:
        structured = QazaqLLMService._structured(
            stage=stage,
            stage_hours_in=stage_hours_in,
            anomaly_score=anomaly_score,
            risk_level=risk_level,
        )
        report = (
            f"Наблюдения\n{structured.observations}\n\n"
            f"Вероятная причина\n{structured.root_cause_hypothesis}\n\n"
            f"Рекомендация\n{structured.recommended_action}"
        )
        return QazaqLLMResponse(structured=structured, report=report)


class AlemSpeechService:
    """Mock adapter for alem.plus Speech (TTS)."""

    @staticmethod
    def synthesize(*, reactor_id: str, risk_level: str, report: str) -> SpeechResponse:
        should_alert = risk_level == "CRITICAL"
        text = (
            f"{reactor_id}. Критическое отклонение. Снизить обороты мешалки. Подтвердить на панели."
            if should_alert
            else f"{reactor_id}. Норма. Голосовой оповещатель не активен."
        )
        return SpeechResponse(
            should_alert=should_alert,
            text=text,
            audio_url=f"https://alem.plus/mock-tts/{reactor_id.replace(' ', '_')}.mp3" if should_alert else None,
        )


_CLOUD_SINGLETON: AlemCloudComputeService | None = None


def get_cloud_compute() -> AlemCloudComputeService:
    global _CLOUD_SINGLETON
    if _CLOUD_SINGLETON is None:
        _CLOUD_SINGLETON = AlemCloudComputeService()
    return _CLOUD_SINGLETON


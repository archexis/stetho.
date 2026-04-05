from __future__ import annotations

from fastapi import APIRouter

from stetho_ai.cvae import StageAwareRealtimeInferencer

from ..core.alem_services import QazaqLLMService
from ..models.alem import RiskLevel
from ..models.diagnostics import ApiDiagnosticsRequest, ApiDiagnosticsResponse

router = APIRouter(prefix="/api", tags=["diagnostics"])


def _risk_from_score(stage: str, score: float) -> RiskLevel:
    w, c = StageAwareRealtimeInferencer._thresholds(stage)
    if score >= c:
        return "CRITICAL"
    if score >= w:
        return "WARNING"
    return "NORMAL"


@router.post("/diagnostics", response_model=ApiDiagnosticsResponse)
async def diagnostics(payload: ApiDiagnosticsRequest) -> ApiDiagnosticsResponse:
    """
    Mocked Qazaq LLM structured report from anomaly score + stage (deterministic templates).
    """
    risk = _risk_from_score(payload.fermentation_stage, payload.anomaly_score)
    llm = QazaqLLMService.report(
        stage=payload.fermentation_stage,
        stage_hours_in=payload.stage_hours_in,
        anomaly_score=payload.anomaly_score,
        risk_level=risk,
    )
    s = llm.structured
    return ApiDiagnosticsResponse(
        observations=s.observations,
        root_cause_hypothesis=s.root_cause_hypothesis,
        recommended_action=s.recommended_action,
        report=llm.report,
    )

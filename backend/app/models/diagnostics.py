from __future__ import annotations

from pydantic import BaseModel, Field

from .alem import Stage


class ApiDiagnosticsRequest(BaseModel):
    anomaly_score: float = Field(..., ge=0.0)
    fermentation_stage: Stage
    stage_hours_in: float = Field(14.0, ge=0.0, description="Fermentation time within stage (hours).")


class ApiDiagnosticsResponse(BaseModel):
    source: str = "qazaq_llm_mock"
    observations: str
    root_cause_hypothesis: str
    recommended_action: str
    report: str

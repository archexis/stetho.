from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


Stage = Literal["Lag", "Log", "Stationary", "Decline"]
RiskLevel = Literal["NORMAL", "WARNING", "CRITICAL"]


class FeaturePayload(BaseModel):
    spectrum: list[float] = Field(..., min_length=64, max_length=256)
    mfcc: list[float] = Field(..., min_length=13, max_length=13)
    f_min_hz: int = Field(2000, ge=1000)
    f_max_hz: int = Field(12000, le=22050)


class InferenceRequest(BaseModel):
    reactor_id: str = Field(..., examples=["Reactor #04-B"])
    stage: Stage
    stage_hours_in: float = Field(..., ge=0.0)
    features: FeaturePayload
    privacy: dict = Field(
        default_factory=lambda: {"raw_audio_transmitted": False, "payload": "features_only"}
    )


class AlemCloudComputeResponse(BaseModel):
    tool: Literal["alem_cloud_compute"] = "alem_cloud_compute"
    model_version: str = "cvae-stage-aware-0.2"
    anomaly_score: float
    recon_error: float
    kl_div: float
    risk_level: RiskLevel
    confidence: int = Field(..., ge=0, le=100)
    thresholds: dict[str, float]
    latency_ms: int = Field(..., ge=0)


class QazaqLLMRequest(BaseModel):
    reactor_id: str
    stage: Stage
    stage_hours_in: float
    anomaly_score: float
    risk_level: RiskLevel


class StructuredDiagnostic(BaseModel):
    """Deterministic operator-facing sections (Qazaq LLM mock contract)."""

    observations: str
    root_cause_hypothesis: str
    recommended_action: str


class QazaqLLMResponse(BaseModel):
    tool: Literal["qazaq_llm"] = "qazaq_llm"
    language: Literal["en", "kk"] = "en"
    structured: StructuredDiagnostic
    report: str
    disclaimer: str = (
        "Industrial decision support only. This system does not provide medical or legal advice."
    )


class SpeechRequest(BaseModel):
    reactor_id: str
    risk_level: RiskLevel
    report: str


class SpeechResponse(BaseModel):
    tool: Literal["alem_speech_tts"] = "alem_speech_tts"
    voice: str = "operator_kz_en"
    should_alert: bool
    text: str
    audio_url: str | None = None


class AlemPipelineResponse(BaseModel):
    reactor_id: str
    stage: Stage
    stage_hours_in: float
    cloud_compute: AlemCloudComputeResponse
    qazaq_llm: QazaqLLMResponse
    speech: SpeechResponse
    privacy: dict
    integration: dict[str, str] = Field(
        default_factory=lambda: {
            "compute": "local",
            "llm": "local",
            "tts": "local",
        },
        description="remote | local для каждого шага конвейера.",
    )


from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class AnomalyRequest(BaseModel):
    """Feature vector: spectrum bins followed by 13 MFCC coefficients (edge pipeline)."""

    features: list[float] = Field(..., min_length=77)
    stage: str = Field(..., description='Fermentation stage: "lag"|"log"|"stationary"|"decline" (case-insensitive).')


class AnomalyResponse(BaseModel):
    score: float
    stage: str
    status: Literal["normal", "warning", "critical"]
    diagnostic_ru: str = Field(
        ...,
        description="Structured operator text (mock Qazaq LLM, Russian).",
    )

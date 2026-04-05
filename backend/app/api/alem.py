from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException

from ..core.alem_remote import post_remote_pipeline
from ..core.alem_services import AlemSpeechService, QazaqLLMService, get_cloud_compute
from ..models.alem import (
    AlemCloudComputeResponse,
    AlemPipelineResponse,
    InferenceRequest,
    QazaqLLMRequest,
    QazaqLLMResponse,
    SpeechRequest,
    SpeechResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/v1/alem", tags=["alem-plus"])


@router.post("/cloud-compute/infer", response_model=AlemCloudComputeResponse)
async def cloud_compute_infer(payload: InferenceRequest) -> AlemCloudComputeResponse:
    if payload.privacy.get("raw_audio_transmitted", False):
        raise HTTPException(status_code=400, detail="Raw audio is prohibited. Send FFT/MFCC features only.")
    return get_cloud_compute().infer(payload)


@router.post("/qazaq/report", response_model=QazaqLLMResponse)
async def qazaq_report(payload: QazaqLLMRequest) -> QazaqLLMResponse:
    return QazaqLLMService.report(
        stage=payload.stage,
        stage_hours_in=payload.stage_hours_in,
        anomaly_score=payload.anomaly_score,
        risk_level=payload.risk_level,
    )


@router.post("/speech/tts", response_model=SpeechResponse)
async def speech_tts(payload: SpeechRequest) -> SpeechResponse:
    return AlemSpeechService.synthesize(
        reactor_id=payload.reactor_id,
        risk_level=payload.risk_level,
        report=payload.report,
    )


@router.post("/pipeline", response_model=AlemPipelineResponse)
async def full_pipeline(payload: InferenceRequest) -> AlemPipelineResponse:
    if payload.privacy.get("raw_audio_transmitted", False):
        raise HTTPException(status_code=400, detail="Raw audio is prohibited. Send FFT/MFCC features only.")

    remote = await post_remote_pipeline(payload.model_dump())
    if remote:
        try:
            return AlemPipelineResponse.model_validate(remote)
        except Exception as e:
            logger.warning("Remote pipeline response invalid, using local: %s", e)

    cloud = get_cloud_compute().infer(payload)
    llm = QazaqLLMService.report(
        stage=payload.stage,
        stage_hours_in=payload.stage_hours_in,
        anomaly_score=cloud.anomaly_score,
        risk_level=cloud.risk_level,
    )
    speech = AlemSpeechService.synthesize(
        reactor_id=payload.reactor_id,
        risk_level=cloud.risk_level,
        report=llm.report,
    )

    return AlemPipelineResponse(
        reactor_id=payload.reactor_id,
        stage=payload.stage,
        stage_hours_in=payload.stage_hours_in,
        cloud_compute=cloud,
        qazaq_llm=llm,
        speech=speech,
        privacy={
            "raw_audio_transmitted": False,
            "payload": "features_only",
        },
        integration={
            "compute": "local",
            "llm": "local",
            "tts": "local",
        },
    )

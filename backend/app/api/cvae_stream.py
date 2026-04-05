from __future__ import annotations

import asyncio

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from ..core.alem_services import get_cloud_compute
from ..models.alem import InferenceRequest

router = APIRouter(prefix="/v1", tags=["cvae-stream"])


@router.websocket("/ws/cvae")
async def cvae_feature_stream(ws: WebSocket) -> None:
    """
    Real-time C-VAE inference over WebSocket. Payloads must be feature vectors only (FFT + MFCC);
    raw audio is not accepted by InferenceRequest schema.
    """
    await ws.accept()
    cloud = get_cloud_compute()
    try:
        while True:
            try:
                msg = await asyncio.wait_for(ws.receive_json(), timeout=120.0)
            except asyncio.TimeoutError:
                await ws.send_json({"type": "ping", "detail": "server_keepalive"})
                continue

            if not isinstance(msg, dict):
                await ws.send_json({"type": "error", "detail": "invalid_json_object"})
                continue
            if msg.get("type") == "ping":
                await ws.send_json({"type": "pong"})
                continue

            try:
                req = InferenceRequest.model_validate(msg)
            except Exception as e:
                await ws.send_json({"type": "error", "detail": f"validation_failed: {e}"})
                continue

            if req.privacy.get("raw_audio_transmitted", False):
                await ws.send_json(
                    {"type": "error", "detail": "raw_audio_prohibited_send_fft_mfcc_only"},
                )
                continue

            out = cloud.infer(req)
            await ws.send_json(
                {
                    "type": "inference",
                    "reactor_id": req.reactor_id,
                    "stage": req.stage,
                    "anomaly_score": out.anomaly_score,
                    "recon_error": out.recon_error,
                    "kl_div": out.kl_div,
                    "risk_level": out.risk_level,
                    "confidence": out.confidence,
                    "thresholds": out.thresholds,
                    "latency_ms": out.latency_ms,
                    "model_version": out.model_version,
                },
            )
    except WebSocketDisconnect:
        return

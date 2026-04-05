"""HTTP-клиент для удалённого Alem Plus (совместимый JSON с локальным /v1/alem/pipeline)."""

from __future__ import annotations

import logging
import os
from typing import Any

import httpx

logger = logging.getLogger(__name__)


def _headers() -> dict[str, str]:
    h = {"Content-Type": "application/json"}
    key = os.getenv("ALEM_PLUS_API_KEY", "").strip()
    if key:
        h["Authorization"] = f"Bearer {key}"
    return h


def pipeline_url() -> str | None:
    base = os.getenv("ALEM_PLUS_BASE_URL", "").strip()
    if not base:
        return None
    path = os.getenv("ALEM_PLUS_PIPELINE_PATH", "/v1/alem/pipeline").strip()
    return base.rstrip("/") + (path if path.startswith("/") else f"/{path}")


async def post_remote_pipeline(body: dict[str, Any]) -> dict[str, Any] | None:
    url = pipeline_url()
    if not url:
        return None
    timeout = float(os.getenv("ALEM_PLUS_TIMEOUT_SEC", "20"))
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            r = await client.post(url, json=body, headers=_headers())
            if r.status_code >= 400:
                logger.warning("Alem Plus pipeline HTTP %s: %s", r.status_code, r.text[:500])
                return None
            data = r.json()
            if isinstance(data, dict):
                integ = data.get("integration")
                if not isinstance(integ, dict):
                    data["integration"] = {"compute": "remote", "llm": "remote", "tts": "remote"}
                return data
    except Exception as e:
        logger.warning("Alem Plus pipeline error: %s", e)
    return None

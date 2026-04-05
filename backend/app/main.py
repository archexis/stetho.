import os

from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()
from fastapi.middleware.cors import CORSMiddleware

from .api.alem import router as alem_router
from .api.anomaly_api import router as anomaly_router
from .api.cvae_stream import router as cvae_stream_router
from .api.diagnostics_api import router as diagnostics_router

app = FastAPI(title="Stetho API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check() -> dict:
    base = os.getenv("ALEM_PLUS_BASE_URL", "").strip()
    return {
        "ok": True,
        "alem_plus_remote": bool(base),
        "alem_plus_base_url_set": bool(base),
    }


app.include_router(cvae_stream_router)
app.include_router(alem_router)
app.include_router(diagnostics_router)
app.include_router(anomaly_router)

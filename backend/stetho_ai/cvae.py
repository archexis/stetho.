from __future__ import annotations

from dataclasses import dataclass

import torch
from torch import nn


STAGES = ("Lag", "Log", "Stationary", "Decline")


def stage_to_onehot(stage: str) -> torch.Tensor:
    try:
        idx = STAGES.index(stage)
    except ValueError as e:
        raise ValueError(f"Unknown stage '{stage}'. Expected one of {STAGES}.") from e
    v = torch.zeros(len(STAGES), dtype=torch.float32)
    v[idx] = 1.0
    return v


@dataclass(frozen=True)
class CVAEOutput:
    recon: torch.Tensor
    mu: torch.Tensor
    logvar: torch.Tensor


class ConditionalVAE(nn.Module):
    """
    Conditional VAE for anomaly detection with stage context conditioning.

    Input is expected to be *features only* (e.g., FFT bins + MFCCs), never raw audio.
    Conditioning is provided as a context vector (e.g., one-hot stage).
    """

    def __init__(
        self,
        x_dim: int,
        c_dim: int,
        z_dim: int = 16,
        hidden: tuple[int, ...] = (256, 128),
        dropout: float = 0.0,
    ) -> None:
        super().__init__()
        self.x_dim = int(x_dim)
        self.c_dim = int(c_dim)
        self.z_dim = int(z_dim)

        def mlp(in_dim: int, out_dim: int) -> nn.Sequential:
            layers: list[nn.Module] = []
            d = in_dim
            for h in hidden:
                layers.append(nn.Linear(d, h))
                layers.append(nn.SiLU())
                if dropout > 0:
                    layers.append(nn.Dropout(dropout))
                d = h
            layers.append(nn.Linear(d, out_dim))
            return nn.Sequential(*layers)

        # Encoder maps (x,c) -> (mu, logvar)
        self.encoder = mlp(self.x_dim + self.c_dim, 2 * self.z_dim)
        # Decoder maps (z,c) -> x_recon
        self.decoder = mlp(self.z_dim + self.c_dim, self.x_dim)

    def encode(self, x: torch.Tensor, c: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
        h = self.encoder(torch.cat([x, c], dim=-1))
        mu, logvar = torch.split(h, self.z_dim, dim=-1)
        return mu, logvar

    def reparameterize(self, mu: torch.Tensor, logvar: torch.Tensor) -> torch.Tensor:
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        return mu + eps * std

    def decode(self, z: torch.Tensor, c: torch.Tensor) -> torch.Tensor:
        return self.decoder(torch.cat([z, c], dim=-1))

    def forward(self, x: torch.Tensor, c: torch.Tensor) -> CVAEOutput:
        mu, logvar = self.encode(x, c)
        z = self.reparameterize(mu, logvar)
        recon = self.decode(z, c)
        return CVAEOutput(recon=recon, mu=mu, logvar=logvar)

    @staticmethod
    def loss(
        x: torch.Tensor,
        recon: torch.Tensor,
        mu: torch.Tensor,
        logvar: torch.Tensor,
        beta: float = 1.0,
    ) -> tuple[torch.Tensor, dict[str, torch.Tensor]]:
        # Reconstruction (MSE) + KL divergence.
        recon_loss = torch.mean(torch.sum((x - recon) ** 2, dim=-1))
        kl = -0.5 * torch.mean(torch.sum(1 + logvar - mu.pow(2) - logvar.exp(), dim=-1))
        total = recon_loss + beta * kl
        return total, {"total": total.detach(), "recon": recon_loss.detach(), "kl": kl.detach()}

    @torch.no_grad()
    def anomaly_score(self, x: torch.Tensor, c: torch.Tensor, beta: float = 1.0) -> torch.Tensor:
        out = self.forward(x, c)
        _, parts = self.loss(x, out.recon, out.mu, out.logvar, beta=beta)
        # Return per-batch scalar score (higher = more anomalous).
        return parts["recon"] + beta * parts["kl"]


class StageAwareRealtimeInferencer:
    """
    Lightweight realtime inference wrapper around ConditionalVAE.
    Uses stage-dependent thresholds so high aeration during Log phase is not over-penalized.

    Production streaming path: FastAPI WebSocket `GET /v1/ws/cvae` accepts JSON matching
    `InferenceRequest` (FFT + MFCC + stage only).
    """

    def __init__(self, model: ConditionalVAE, beta: float = 0.2) -> None:
        self.model = model
        self.beta = float(beta)
        self.model.eval()

    @staticmethod
    def _thresholds(stage: str) -> tuple[float, float]:
        # warning, critical
        stage_map = {
            "Lag": (0.20, 0.34),
            "Log": (0.34, 0.52),  # higher tolerance due to aeration noise/viscosity
            "Stationary": (0.26, 0.40),
            "Decline": (0.24, 0.38),
        }
        return stage_map.get(stage, (0.26, 0.40))

    @staticmethod
    def _risk(score: float, warning: float, critical: float) -> str:
        if score >= critical:
            return "CRITICAL"
        if score >= warning:
            return "WARNING"
        return "NORMAL"

    def infer_features(
        self,
        *,
        spectrum: list[float],
        mfcc: list[float],
        stage: str,
        device: str = "cpu",
    ) -> dict[str, float | str | dict[str, float]]:
        """
        Realtime inference over edge-exported features only (FFT/MFCC), never raw audio.
        """
        if len(spectrum) == 0 or len(mfcc) == 0:
            raise ValueError("spectrum and mfcc must be non-empty")

        x_vec = torch.tensor([spectrum + mfcc], dtype=torch.float32, device=device)
        c_vec = stage_to_onehot(stage).to(device=device).unsqueeze(0)

        with torch.no_grad():
            out = self.model.forward(x_vec, c_vec)
            recon = torch.mean(torch.sum((x_vec - out.recon) ** 2, dim=-1)).item()
            kl = (
                -0.5
                * torch.mean(torch.sum(1 + out.logvar - out.mu.pow(2) - out.logvar.exp(), dim=-1)).item()
            )
            score = float(recon + self.beta * kl)

        warning, critical = self._thresholds(stage)
        risk = self._risk(score, warning, critical)
        confidence = max(50, min(99, int(round(60 + min(0.35, abs(score - warning)) * 100))))

        return {
            "anomaly_score": round(score, 5),
            "recon_error": round(recon, 5),
            "kl_div": round(kl, 5),
            "risk_level": risk,
            "confidence": confidence,
            "thresholds": {"warning": warning, "critical": critical},
        }


function localMaxima(mag, i) {
  if (i <= 0 || i >= mag.length - 1) return false;
  return mag[i] > mag[i - 1] && mag[i] >= mag[i + 1];
}

export function computePeakStability({ fftHistory, peakBin }) {
  const vals = (fftHistory ?? [])
    .map((f) => (f?.fft_magnitude ? f.fft_magnitude[peakBin] : undefined))
    .filter((v) => typeof v === "number");

  if (vals.length < 2) return 0;
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const variance = vals.reduce((a, b) => a + (b - mean) * (b - mean), 0) / vals.length;
  const std = Math.sqrt(variance);
  const stability = 1.0 - std / (mean + 1e-6);
  return Math.max(0, Math.min(100, stability * 100));
}

export function computeHarmonicPeaks({ fftMagnitude, fftHistory, sampleRateHz, fftBins, topK = 6 }) {
  const mag = fftMagnitude ?? [];
  if (!mag.length || !sampleRateHz || !fftBins) return [];

  const maxMag = Math.max(...mag);
  const minAbs = maxMag * 0.20; // keep peaks above noise floor

  const candidates = [];
  for (let i = 1; i < mag.length - 1; i++) {
    if (!localMaxima(mag, i)) continue;
    if (mag[i] < minAbs) continue;

    const freqHz = (i / Math.max(1, fftBins - 1)) * (sampleRateHz / 2);
    const stabilityPercent = computePeakStability({ fftHistory, peakBin: i });
    candidates.push({
      bin: i,
      frequencyHz: freqHz,
      magnitude: mag[i],
      stabilityPercent,
    });
  }

  candidates.sort((a, b) => b.magnitude - a.magnitude);
  const peaks = candidates.slice(0, topK);

  // Optional: sort by frequency for a more "table-like" feel.
  peaks.sort((a, b) => a.frequencyHz - b.frequencyHz);
  return peaks;
}


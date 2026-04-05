import { computeMagnitudeBins } from "./signal";

export function computeCaptureFeatures(samples) {
  if (!samples || samples.length === 0) {
    return { rms: 0, peak: 0, mean_abs: 0, spectral_rolloff: 0 };
  }

  let sumSq = 0;
  let sumAbs = 0;
  let peak = 0;
  for (const v of samples) {
    const av = Math.abs(v);
    sumSq += v * v;
    sumAbs += av;
    if (av > peak) peak = av;
  }
  const rms = Math.sqrt(sumSq / samples.length);
  const mean_abs = sumAbs / samples.length;

  // Approximate spectral roll-off: 85% of total energy across bins.
  const mags = computeMagnitudeBins(samples, 64);
  const energy = mags.reduce((acc, m) => acc + m * m, 0) || 1;
  let cum = 0;
  let rollBin = 0;
  for (let i = 0; i < mags.length; i++) {
    cum += mags[i] * mags[i];
    if (cum / energy >= 0.85) {
      rollBin = i;
      break;
    }
  }

  // Normalize to 0..1 to match mock provider expectations.
  const spectral_rolloff = rollBin / Math.max(1, mags.length - 1);

  return { rms, peak, mean_abs, spectral_rolloff };
}


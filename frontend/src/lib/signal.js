function complexMag(re, im) {
  return Math.sqrt(re * re + im * im);
}

// High-performance enough for our MVP: compute only the first `bins` magnitude bins.
export function computeMagnitudeBins(samples, bins = 64) {
  const N = samples.length;
  if (N === 0) return new Array(bins).fill(0);

  const out = new Array(bins).fill(0);
  for (let k = 0; k < bins; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      const x = samples[n];
      const angle = (2 * Math.PI * k * n) / N;
      re += x * Math.cos(angle);
      im -= x * Math.sin(angle);
    }
    // Normalize by N so magnitudes stay stable across buffer sizes.
    out[k] = complexMag(re / N, im / N);
  }

  // Normalize magnitude range for consistent chart scaling.
  const mx = Math.max(...out);
  const denom = mx > 0 ? mx : 1;
  return out.map((v) => v / denom);
}

export function samplesToWaveformData(samples, maxPoints = 240) {
  const sliced = samples.length > maxPoints ? samples.slice(-maxPoints) : samples;
  return sliced.map((y, idx) => ({
    t: idx,
    y,
  }));
}


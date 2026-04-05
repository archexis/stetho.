const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8001";

export async function analyzeReactor({ reactorId, probabilityCutoff, captureFeatures }) {
  const response = await fetch(`${API_BASE_URL}/v1/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reactor_id: reactorId,
      probability_cutoff: probabilityCutoff,
      capture_features: captureFeatures ?? null,
    }),
  });

  if (!response.ok) {
    throw new Error("Analysis request failed");
  }

  return response.json();
}

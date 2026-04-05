import { useEffect, useMemo, useRef, useState } from "react";

const defaultApiBase = "http://127.0.0.1:8001";

function httpToWs(httpUrl) {
  if (httpUrl.startsWith("https://")) return httpUrl.replace("https://", "wss://");
  if (httpUrl.startsWith("http://")) return httpUrl.replace("http://", "ws://");
  return httpUrl;
}

export function useBioStream({ reactorId, thresholdPercent, apiBaseUrl }) {
  const base = apiBaseUrl ?? import.meta.env.VITE_API_BASE_URL ?? defaultApiBase;
  const wsUrl = useMemo(() => `${httpToWs(base)}/v1/stream`, [base]);

  const wsRef = useRef(null);
  const [connection, setConnection] = useState("disconnected"); // connected | reconnecting
  const [baselineFft, setBaselineFft] = useState(null);
  const [baselineWaveform, setBaselineWaveform] = useState(null);
  const [sampleRateHz, setSampleRateHz] = useState(400);
  const [latestFrame, setLatestFrame] = useState(null);
  const [frames, setFrames] = useState([]);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConnection("reconnecting");

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      if (cancelled) return;
      setConnection("connected");
      ws.send(JSON.stringify({ type: "set_reactor", reactor_id: reactorId }));
      if (typeof thresholdPercent === "number") {
        ws.send(JSON.stringify({ type: "set_threshold", threshold_percent: thresholdPercent }));
      }
    };

    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg?.type === "baseline") {
          setBaselineFft(msg.baseline_fft_magnitude);
          setBaselineWaveform(msg.baseline_waveform);
          if (typeof msg.sample_rate_hz === "number") setSampleRateHz(msg.sample_rate_hz);
        }
        if (msg?.type === "frame") {
          setLatestFrame(msg);
          setFrames((prev) => [msg, ...prev].slice(0, 60));
        }
      } catch {
        // ignore malformed frames
      }
    };

    ws.onerror = () => {
      if (cancelled) return;
      setConnection("disconnected");
    };

    ws.onclose = () => {
      if (cancelled) return;
      setConnection("disconnected");
    };

    return () => {
      cancelled = true;
      try {
        ws.close();
      } catch {
        // ignore
      }
    };
  }, [wsUrl, reactorId, thresholdPercent]);

  // Push threshold updates without forcing a reconnect.
  useEffect(() => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    if (typeof thresholdPercent !== "number") return;
    try {
      ws.send(JSON.stringify({ type: "set_threshold", threshold_percent: thresholdPercent }));
    } catch {
      // ignore
    }
  }, [thresholdPercent]);

  const sendCommand = (payload) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    try {
      ws.send(JSON.stringify(payload));
      return true;
    } catch {
      return false;
    }
  };

  return {
    connection,
    baselineFft,
    baselineWaveform,
    sampleRateHz,
    latestFrame,
    recentFrames: frames,
    sendCommand,
  };
}


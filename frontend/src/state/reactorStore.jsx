/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useReducer } from "react";

export const ReactorStatus = {
  Idle: "Idle",
  Recording: "Recording",
  Analyzing: "Analyzing",
  Result: "Result",
};

const ReactorContext = createContext(null);

const initialState = {
  activePanel: "Monitor", // Monitor | History | Sensors | Thresholds | Export
  status: ReactorStatus.Idle,
  probabilityCutoff: 0.5,
  sensors: {
    voltage: 226.0,
    temperature: 52.0,
    connection: "Connected", // Connected | Degraded | Lost
  },
  waveform: [],
  fftMagnitude: [],
  latestScan: null, // AnalyzeResponse-like
  history: [], // max 10
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ACTIVE_PANEL":
      return { ...state, activePanel: action.panel };
    case "SET_STATUS":
      return { ...state, status: action.status };
    case "SET_PROBABILITY_CUTOFF":
      return { ...state, probabilityCutoff: action.value };
    case "UPDATE_SENSORS":
      return { ...state, sensors: { ...state.sensors, ...action.patch } };
    case "SET_WAVEFORM":
      return { ...state, waveform: action.waveform };
    case "SET_FFT":
      return { ...state, fftMagnitude: action.fftMagnitude };
    case "SET_LATEST_SCAN":
      return { ...state, latestScan: action.scan };
    case "PUSH_HISTORY": {
      const next = [action.scan, ...state.history];
      return { ...state, history: next.slice(0, 10) };
    }
    default:
      return state;
  }
}

export function ReactorProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <ReactorContext.Provider value={value}>{children}</ReactorContext.Provider>;
}

export function useReactor() {
  const ctx = useContext(ReactorContext);
  if (!ctx) throw new Error("useReactor must be used within ReactorProvider");
  return ctx;
}


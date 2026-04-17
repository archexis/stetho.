// src/services/AlemService.js

// URL эндпоинта Alem Plus
const ALEM_API_URL = import.meta.env.VITE_ALEM_API_URL || 'https://api.alem.ai/v1';
const ALEM_API_KEY = import.meta.env.VITE_ALEM_API_KEY;

export const AlemService = {
  async getDiagnostics(sensorId, temperature, ph, vibroLevel) {
    if (!ALEM_API_KEY) {
      console.warn("ВНИМАНИЕ: VITE_ALEM_API_KEY не установлен. Включается режим эмуляции для предотвращения падения UI.");
      return this._mockDiagnostics(vibroLevel);
    }

    try {
      // Промпт для агента на базе системных данных
      const systemPrompt = `Ты - AI-инженер на станции мониторинга биореакторов.
С датчика ${sensorId} поступили показания: Температура ${temperature}, pH ${ph}, Вибрация: ${vibroLevel}.
Если вибрация "Отклонение" (critical), сымитируй анализ спектрограммы.
Ответь строго в формате JSON:
{
  "status": "anomaly_detected" или "nominal",
  "llm_report": {
    "log1": "ОПИСАНИЕ: краткий анализ проблемы",
    "log2": "Alem-RAG: совпадение сигнатуры",
    "log3": "ДЕЙСТВИЕ: что нужно сделать"
  },
  "metrics": {
    "freqBand": "частотный диапазон",
    "varDev": "уровень отклонения (%)",
    "trend": "тренд ухудшения",
    "estFailure": "оценка до поломки в часах",
    "confidence": "вероятность от 0 до 100%"
  }
}`;

      // Делаем реальный запрос к LLM / RAG (Обычно OpenAI-комфортный формат)
      const response = await fetch(`${ALEM_API_URL}/chat/completions`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${ALEM_API_KEY}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          model: "qwen-max", // Или другая модель, доступная вам в Alem Plus
          messages: [
            {"role": "system", "content": "You output only clean raw JSON without backticks or markdown markers like ```json ... ```."},
            {"role": "user", "content": systemPrompt}
          ],
          temperature: 0.1, // Низкая креативность для точного JSON
        })
      });

      if (!response.ok) throw new Error(`Alem API error: ${response.status}`);
      
      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Парсим JSON, который вернула сетка
      return JSON.parse(content);
      
    } catch (e) {
      console.error("Alem API Error: ", e);
      // Fallback чтобы приложение на хакатоне не развалилось, если отвалился интернет
      return this._mockDiagnostics(vibroLevel);
    }
  },

  // Запасной путь для стабильности
  _mockDiagnostics(vibroLevel) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (vibroLevel === 'critical' || vibroLevel === 'Отклонение') {
          resolve({
            status: "anomaly_detected",
            llm_report: {
              log1: "Alem Service Fallback: Abnormal vibration detected.",
              log2: "RAG Match: 94% similarity to cavitation signature.",
              log3: "Action: Immediate physical inspection."
            },
            metrics: { freqBand: "Mid-Range", varDev: "+18%", trend: "Rising", estFailure: "12h", confidence: "82%" }
          });
        } else {
           resolve({ status: "nominal", llm_report: null, metrics: null });
        }
      }, 1000);
    });
  }
};

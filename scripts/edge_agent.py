import os
import requests
import json
import time

# Настройки Alem Plus
ALEM_API_URL = os.getenv("ALEM_API_URL", "https://api.alem.ai/v1")
ALEM_API_KEY = os.getenv("ALEM_API_KEY")

def extract_acoustic_features(audio_stream):
    """
    Эмуляция извлечения фичей (в реальности - Librosa MFCC или FFT).
    """
    return {
        "mid_freq_energy": 0.82,
        "variance_dev": 14.5,
        "pattern_match": "impeller_harmonic_disturbance"
    }

def analyze_signature(sensor_id: str):
    """
    Отправляет фичи в пайплайн Alem Plus для RAG-анализа и LLM.
    """
    print(f"[{sensor_id}] Запущено чтение с пьезодатчика...")
    time.sleep(1) # Имитация работы
    features = extract_acoustic_features("dummy_stream")
    
    headers = {
        "Authorization": f"Bearer {ALEM_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "agent": "biofarm_vibro_analyst",
        "sensor_id": sensor_id,
        "telemetry": features,
        "query": "Сравни эти акустические фичи с базой знаний (Milvus). Какова стадия ферментации или есть ли риск кавитации? Сформулируй краткий отчет для технолога."
    }
    
    print(f"[{sensor_id}] Отправка телеметрии в Alem Plus...")
    
    if not ALEM_API_KEY:
        print("[!] ВНИМАНИЕ: ALEM_API_KEY не задан. Запуск в режиме эмуляции.")
        print("Эмуляция ответа ИИ: Аномальный паттерн вибрации обнаружен в диапазоне средних частот.\nУверенность: 82.1%")
        return

    try:
        response = requests.post(f"{ALEM_API_URL}/agent/invoke", headers=headers, json=payload, timeout=15)
        response.raise_for_status()
        
        result = response.json()
        print(f"Отчет AlemLLM: \n{result.get('output', 'Нет данных')}")
        
    except requests.exceptions.RequestException as e:
        print(f"Ошибка соединения с API Alem Plus: {e}")

if __name__ == "__main__":
    analyze_signature("BIO_R02")

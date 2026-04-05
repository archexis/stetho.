# Stetho

Мониторинг линии по признакам с edge (без сырого аудио). Один экран: статус, отчёт, рекомендации.

## Запуск

**1. API** (`backend`):

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**2. Симулятор потока** (отдельный терминал):

```bash
cd next-dashboard
npm install && npm run ws
```

**3. Интерфейс** (ещё один терминал):

```bash
cd next-dashboard
npm run dev
```

Браузер: http://localhost:3000  

Переменные: в `next-dashboard` скопировать `.env.example` → `.env.local` при необходимости. Реальный энкодер должен отдавать WebSocket-сообщения с тем же форматом, что и симулятор (`schema: stetho.edge.features.v1`, признаки в `features`).

## Облако Alem Plus

В `backend` скопировать `.env.example` в `.env`, задать `ALEM_PLUS_BASE_URL` (и при необходимости ключ). При сбое запроса используется локальный расчёт.

## API

- `GET /health`
- `POST /v1/alem/pipeline` — признаки FFT/MFCC + фаза

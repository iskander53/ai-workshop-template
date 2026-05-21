# AI Workshop Template

A minimal full-stack starter — **React + Vite** frontend, **Node.js + Express** backend, **SQLite** for local dev and **PostgreSQL** on Render. Designed to be downloaded, customized, and deployed for free on Render.

## Stack

- **Frontend:** React 18 + Vite 5 (JavaScript)
- **Backend:** Node.js + Express (ES modules)
- **Database:** SQLite locally (zero install), PostgreSQL on Render — auto-detected from `DATABASE_URL`
- **Deploy:** Render free tier via `render.yaml` (Blueprint), built with Docker

## Project structure

```
.
├── backend/
│   ├── package.json
│   ├── server.js
│   └── db.js
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       └── styles.css
├── Dockerfile
├── render.yaml
├── .env.example
├── .gitignore
├── .dockerignore
└── README.md
```

## Local development

No database to install — SQLite is built in. The backend creates `backend/data.sqlite` on first boot.

Open two terminals:

```bash
# Terminal 1 — backend
cd backend
npm install
npm run dev
```

```bash
# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

Then open <http://localhost:5173>. Vite proxies `/api/*` to the backend on port 3001.

## Deploy to Render

1. Push this repo to GitHub.
2. In Render, click **New → Blueprint** and connect the repo.
3. Render reads `render.yaml`, creates the free Postgres database, and deploys the web service. `DATABASE_URL` is wired up automatically — no copy/paste.

Notes on the free tier:
- The free web service sleeps after ~15 minutes of inactivity; the first request after sleep has a ~30s cold start.
- Render's free Postgres database expires after 30 days. Renew or upgrade before then if you want to keep the data.

## Endpoints

- `GET /api/health` — `{ "status": "ok", "db": "sqlite" | "postgres" }`
- `GET /api/hello` — `{ "message": "Hello from the backend 👋" }`
- `GET /*` (production only) — serves the built React frontend from `backend/public/`

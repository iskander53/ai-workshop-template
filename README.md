# AI Workshop Template

A minimal full-stack starter: React (Vite) frontend, Node.js/Express backend, Sequelize ORM with SQLite for local dev and Postgres on Render. Designed to be downloaded, customized with AI tools, and deployed free on [Render](https://render.com).

## Stack

- **Frontend:** React 18 + Vite 5 (JavaScript)
- **Backend:** Node.js + Express (ES modules)
- **Database:** Sequelize ORM — **SQLite locally**, **Postgres on Render** (picked at startup from `DATABASE_URL`)
- **Deploy:** Render free tier via `render.yaml` Blueprint (Docker)

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

No database to install — SQLite is built in. Run the backend and frontend in two terminals.

**Terminal 1 — backend:**

```bash
cd backend
npm install
npm run dev
```

Backend boots on `http://localhost:3001` and creates `backend/data.sqlite` on first run.

**Terminal 2 — frontend:**

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api/*` to the backend.

## Deploy to Render

1. Push this repo to GitHub.
2. In Render, click **New → Blueprint** and connect the repo. Render reads `render.yaml` and provisions:
   - `ai-workshop-db` — free Postgres
   - `ai-workshop-web` — free Docker web service, with `DATABASE_URL` wired from the database
3. Wait for the first build. The web service serves the built React app and the API from the same origin.

Notes:

- Render's free web service sleeps after inactivity, with a ~30s cold start on the next request.
- Render's free Postgres expires 30 days after creation — re-provision via Blueprint if needed.

## Endpoints

- `GET /api/health` — `{ "status": "ok", "db": "sqlite" | "postgres" }`
- `GET /api/hello` — `{ "message": "Hello from the backend 👋" }`
- `GET /*` (production only) — serves the built React app

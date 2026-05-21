# AI Workshop Template

A minimal full-stack starter — React (Vite) frontend, Express backend, Sequelize ORM (SQLite locally, Postgres on Render) — that deploys free on Render via a Blueprint.

## Stack

- **Frontend:** React 18 + Vite (JavaScript)
- **Backend:** Node.js + Express, ES modules
- **Database:** Sequelize ORM — SQLite for local dev, PostgreSQL on Render. Dialect is picked at startup from `DATABASE_URL`.
- **Deploy:** Render free tier (free web service + free Postgres) via `render.yaml`.

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

No database to install — SQLite is built in and the backend creates `backend/data.sqlite` on first run.

Open two terminals.

Terminal 1 — backend:

```
cd backend
npm install
npm run dev
```

Terminal 2 — frontend:

```
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## Deploy to Render

1. Push this repo to GitHub.
2. In Render: **New → Blueprint**, connect the repo. Render reads `render.yaml` and provisions the web service + free Postgres database.
3. `DATABASE_URL` is wired from the database automatically — nothing to copy/paste.

Notes on the free tier:

- The web service sleeps after inactivity, so the first request after idle takes ~30s.
- Render's free Postgres database expires 30 days after creation.

## Endpoints

- `GET /api/health` — checks the DB connection, returns `{ status, db }`.
- `GET /api/hello` — returns a hello-world JSON message.
- `GET /*` (production only) — serves the built React app.

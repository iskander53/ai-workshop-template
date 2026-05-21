# Prompt: Build a minimal full-stack template

Build a minimal full-stack project template that someone can download, customize, and deploy for free. Target audience: product managers using AI to build prototypes — so the template should be small, conventional, and easy to extend.

## Stack

- **Frontend:** React via Vite (JavaScript, not TypeScript — keep it simple)
- **Backend:** Node.js with Express, ES modules (`"type": "module"`)
- **Database:** dual driver — **SQLite for local dev**, **PostgreSQL on Render**. The backend auto-detects which to use from `DATABASE_URL`.
- **Deploy target:** Render free tier (free web service + free Postgres), provisioned via `render.yaml` (Blueprint).
- **Docker:** only used by Render's build. Local dev must work without Docker installed.

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

## Backend requirements

- Express server, listens on `PORT` env (default `3001`).
- ES modules.
- `db.js` exports `query(sql, params)` and `dbKind`. Picks driver at startup:
  - If `DATABASE_URL` starts with `postgres://` or `postgresql://` → use `pg` Pool. In production, enable SSL with `rejectUnauthorized: false` (Render's Postgres needs this).
  - Otherwise → use `better-sqlite3` at `./data.sqlite` (override path via `SQLITE_PATH`).
- The `query()` API must be **portable across both drivers**:
  - Use `?` placeholders in SQL. For Postgres, translate them to `$1, $2, ...` inside `query()`.
  - Return an array of row objects for SELECTs.
  - For non-SELECT statements on SQLite (`stmt.reader === false`), return `[{ changes, lastInsertRowid }]`.
- Endpoints:
  - `GET /api/health` — runs `SELECT 1`, returns `{ status: "ok", db: dbKind }` on success, 500 with error message on failure.
  - `GET /api/hello` — returns `{ message: "Hello from the backend 👋" }`.
- In production, serve the built frontend:
  - `app.use(express.static(path.join(__dirname, "public")))`
  - Catch-all `GET *` → `sendFile("public/index.html")` so client-side routing works.
- Log `db: ${dbKind}` on boot.

### Backend dependencies

- `express`, `pg` as `dependencies`.
- `better-sqlite3` as an **`optionalDependency`** — critical. This prevents `npm install` from failing on `node:20-alpine` (no prebuilts for musl). On Render, only Postgres is used, so the missing module is fine.

### Backend scripts

```json
{
  "start": "node server.js",
  "dev": "node --watch server.js"
}
```

## Frontend requirements

- React 18 + Vite 5, JSX (not TSX).
- `vite.config.js`:
  - Dev server on port `5173`.
  - Proxy `/api` → `http://localhost:3001`.
  - Build output to `dist/`.
- `src/App.jsx` is a simple smoke-test page:
  - On mount, fetches `/api/hello` and `/api/health` and displays both.
  - Inline styling via `src/styles.css` — dark theme is fine, keep CSS minimal (~30 lines).
- `src/main.jsx` mounts `<App />` into `#root` with `React.StrictMode`.

### Frontend dependencies

- `react`, `react-dom` as `dependencies`.
- `vite`, `@vitejs/plugin-react` as `devDependencies`.

### Frontend scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

## Dockerfile (Render-only)

Multi-stage build, base image `node:20-alpine`:

1. **Stage 1 — frontend-build:** copy `frontend/package*.json`, `npm install`, copy rest, `npm run build`.
2. **Stage 2 — backend-deps:** copy `backend/package*.json`, `npm install --omit=dev`. (better-sqlite3 will fail silently here — that's by design.)
3. **Stage 3 — runtime:**
   - `NODE_ENV=production`, `PORT=3001`.
   - Copy `backend/` source, `backend/node_modules` from stage 2, and the built frontend (`frontend/dist`) into `backend/public/`.
   - `EXPOSE 3001`.
   - `CMD ["node", "server.js"]` with `WORKDIR /app/backend`.

## render.yaml (Blueprint)

```yaml
databases:
  - name: ai-workshop-db
    plan: free
    databaseName: app
    user: app

services:
  - type: web
    name: ai-workshop-web
    runtime: docker
    plan: free
    dockerfilePath: ./Dockerfile
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3001
      - key: DATABASE_URL
        fromDatabase:
          name: ai-workshop-db
          property: connectionString
```

`DATABASE_URL` must be wired from the database via `fromDatabase` — participants never copy/paste a connection string.

## .gitignore

```
node_modules/
dist/
build/
.env
.env.local
*.log
.DS_Store
*.sqlite
*.sqlite-journal
```

## .dockerignore

Exclude `node_modules`, `dist`, `build`, `.env*`, `.git`, logs, `.DS_Store`.

## .env.example

`DATABASE_URL` should be commented out by default, with a comment explaining: blank locally → SQLite; injected automatically on Render → Postgres. Include `PORT=3001` and `NODE_ENV=development`.

## README requirements

Include these sections, in this order:

1. One-paragraph intro naming the stack and that it deploys free on Render.
2. **Stack** — bullet list including the local-SQLite / Render-Postgres split.
3. **Project structure** — file tree.
4. **Local development** — explicitly state "no database to install, SQLite is built in." Two-terminal flow: backend `npm install && npm run dev`, frontend `npm install && npm run dev`. Open `http://localhost:5173`.
5. **Deploy to Render** — push to GitHub, New → Blueprint, connect repo. Mention the free web service sleeps after inactivity (~30s cold start) and Render's free Postgres expires after 30 days.
6. **Endpoints** — list the three endpoints.

Do **not** include a "Run with Docker locally" section. Docker is for Render only.

## Constraints / non-goals

- No TypeScript.
- No ORM (Prisma/Drizzle/etc.) — raw SQL via the `query()` helper. Participants can add an ORM if they want.
- No auth, no sessions, no routing library — this is a starting template, not an app.
- No tests, no linter config, no CI. Keep the file count low.
- No example tables or seed data — the `query("SELECT 1")` in the health check is the only SQL.
- Don't add comments that explain *what* the code does. One short comment at the top of `db.js` explaining *why* there are two drivers is fine.

## Verification before declaring done

1. `cd backend && npm install && PORT=3001 node server.js` — boots, logs `db: sqlite`, creates `backend/data.sqlite`.
2. `curl http://localhost:3001/api/health` → `{"status":"ok","db":"sqlite"}`.
3. `curl http://localhost:3001/api/hello` → `{"message":"Hello from the backend 👋"}`.
4. `cd frontend && npm install && npm run build` — builds without errors.
5. Copy `frontend/dist` to `backend/public`, restart backend, `curl http://localhost:3001/` returns the built `index.html` with 200.
6. Confirm `docker` is **not** required for any of the above.

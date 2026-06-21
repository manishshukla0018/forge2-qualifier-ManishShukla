# Forge 2 Kanban

Forge 2 Kanban is a Trello-style Kanban application with a Laravel 12 API backend, SQLite persistence, and a React + Vite frontend. It supports boards, Todo/Doing/Done lists, cards, labels, member assignment, due dates, and overdue highlighting.

## Features

- Boards with default Todo, Doing, and Done lists
- Cards with editable title and description
- Move cards between lists
- Tags/labels with colors
- Members and member assignment
- Due date picker
- Overdue cards visually highlighted unless they are in Done
- Seeded demo board data
- REST API integration from the React frontend
- Vercel frontend config and Render/Railway backend config

## Project Structure

```text
backend/   Laravel 12 API, SQLite migrations, models, controllers, seeders
frontend/  React + Vite Kanban application
screenshots/  Submission screenshots and visual references
skills/       Hermes orchestration skill
evidence/     Agent-use, Slack-loop, and autonomous-run evidence index
openclaw.json OpenClaw/Hermes project configuration
```

## Agent Workflow Evidence

- OpenClaw configuration: `openclaw.json`
- Sanitized Hermes configuration: `hermes-config.yaml`
- Hermes skill: `skills/hermes-orchestrator/SKILL.md`
- Verbatim conversation excerpts: `agent-log.md`
- Evidence status and capture requirements: `evidence/README.md`

Original Slack screenshots and an exported autonomous Hermes run must be added before claiming those handbook requirements as complete. Templates and generated chat mockups are not accepted as proof.

## Backend Installation

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
php artisan migrate --seed
php artisan serve
```

The API runs at `http://127.0.0.1:8000`.

Useful endpoints:

- `GET /api/health`
- `GET /api/boards`
- `GET /api/boards/{board}`
- `POST /api/lists/{list}/cards`
- `PATCH /api/cards/{card}`
- `PATCH /api/cards/{card}/move`
- `GET /api/members`
- `GET /api/tags`

## Frontend Installation

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend runs at `http://127.0.0.1:5173`.

Set `VITE_API_URL` in `frontend/.env` when the backend runs somewhere else:

```bash
VITE_API_URL=http://127.0.0.1:8000/api
```

## Production Build

```bash
cd frontend
npm run build
```

```bash
cd backend
php artisan test
```

## Deployment URLs

| Service | URL |
| --- | --- |
| Frontend Vercel | https://forge2-qualifier-manish-shukla.vercel.app |
| Backend Render | https://forge2-qualifier-manishshukla.onrender.com |
| Public GitHub repository | https://github.com/manishshukla0018/forge2-qualifier-ManishShukla |

The GitHub repository was confirmed public on 2026-06-21. On the same date, the Vercel frontend and Render health endpoint returned HTTP 200, and a temporary live API smoke test verified card creation, editing, movement, member/tag assignment, due dates, and overdue state before cleaning up its test board.

## Deployment Notes

### Frontend on Vercel

1. Import the public GitHub repository in Vercel.
2. Set the project root to `frontend`.
3. Set `VITE_API_URL` to the deployed backend API URL plus `/api`.
4. Build command: `npm run build`.
5. Output directory: `dist`.

### Backend on Render

1. Create a Render web service from the public GitHub repository.
2. Use `backend/render.yaml` as the blueprint or configure the Docker service manually.
3. Add a persistent disk mounted at `/var/data`.
4. Set `DB_CONNECTION=sqlite` and `DB_DATABASE=/var/data/database.sqlite`.
5. Set `FRONTEND_URL` to the Vercel URL.
6. Verify `GET /api/health`.

### Backend on Railway

1. Create a Railway project from the public GitHub repository.
2. Use `backend/railway.json` and `backend/Dockerfile`.
3. Set `DB_CONNECTION=sqlite`, `DB_DATABASE=/app/database/database.sqlite`, `APP_KEY`, and `FRONTEND_URL`.
4. Verify `GET /api/health`.

## Demo Data

Run `php artisan migrate --seed` to create:

- A `Forge 2 Launch Board`
- Todo, Doing, Done lists
- Demo members
- Feature, Bug, Design, and Ops labels
- Cards including one overdue item for visual verification

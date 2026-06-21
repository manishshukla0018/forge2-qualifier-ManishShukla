# Architecture

## System Overview

Forge 2 Kanban uses a split app structure:

- `backend/`: Laravel 12 REST API with SQLite persistence
- `frontend/`: React + Vite single-page Kanban interface

The frontend calls the backend through `VITE_API_URL`, defaults to `http://127.0.0.1:8000/api`, and keeps board state refreshed after mutations.

## Hermes Responsibilities

Hermes is responsible for planning, orchestration, integration quality, and final delivery readiness:

- Interpret the human request and Forge 2 requirements
- Break work into backend, frontend, deployment, and documentation milestones
- Own API contract quality and end-to-end feature coverage
- Verify that docs, commits, and deliverables are submission-ready
- Track blockers such as missing deployment credentials

## OpenClaw Responsibilities

OpenClaw is responsible for implementation execution inside the planned workstream:

- Create Laravel models, migrations, controllers, and routes
- Build React components, API client methods, and UI states
- Implement Kanban interactions such as card creation, editing, movement, assignment, labels, and overdue display
- Add deploy configuration files and project documentation
- Keep work incremental and committed with meaningful messages

## Agent Workflow

1. Backend first: create Laravel structure, SQLite configuration, migrations, models, REST controllers, and seed data.
2. Frontend second: create Vite app, Kanban board page, list columns, cards, modal editing, member/tag controls, due date input, and API integration.
3. Deployment third: add Vercel, Render, Railway, Docker, and startup configuration.
4. Documentation fourth: add README, architecture notes, agent log, and screenshots folder.
5. Verification last: run available checks, inspect git history, and report deployment blockers.

## Folder Structure

```text
.
|-- README.md
|-- ARCHITECTURE.md
|-- agent-log.md
|-- screenshots/
|   |-- README.md
|   `-- kanban-board.svg
|-- backend/
|   |-- app/
|   |   |-- Http/Controllers/Api/
|   |   `-- Models/
|   |-- bootstrap/
|   |-- config/
|   |-- database/
|   |   |-- migrations/
|   |   `-- seeders/
|   |-- deploy/
|   |-- public/
|   |-- routes/
|   |-- storage/
|   |-- tests/
|   |-- Dockerfile
|   |-- Procfile
|   |-- composer.json
|   |-- railway.json
|   `-- render.yaml
`-- frontend/
    |-- src/
    |   |-- App.jsx
    |   |-- api.js
    |   |-- main.jsx
    |   `-- styles.css
    |-- index.html
    |-- package.json
    |-- vercel.json
    `-- vite.config.js
```

## Data Model

- `Board` has many `ListModel` records.
- `ListModel` belongs to a board and has many cards.
- `Card` belongs to a list and optionally belongs to a member.
- `Card` has many tags through the `card_tag` pivot table.
- `Tag` has a color used by the frontend label UI.
- `Member` has an avatar color used for compact card assignment display.

## API Contract

The frontend uses these core endpoints:

- `GET /api/boards`
- `GET /api/boards/{board}`
- `POST /api/boards`
- `POST /api/boards/{board}/lists`
- `POST /api/lists/{list}/cards`
- `PATCH /api/cards/{card}`
- `PATCH /api/cards/{card}/move`
- `DELETE /api/cards/{card}`
- `GET|POST /api/members`
- `GET|POST /api/tags`

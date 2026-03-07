# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UNIT-01 Architect is an AI-powered software design assistant (in French). It generates architectures, development plans, and technical specifications from a project idea, using the Claude API.

## Architecture

Monorepo with two top-level directories:

- `frontend/` — Vue.js 3 + Vite + Tailwind CSS 4
- `backend/` — Node.js + Express + Claude API

Target deployment: GCP Cloud Run.

## Commands

All commands run from their respective subdirectory.

### Frontend (`cd frontend`)

```bash
npm install       # install dependencies
npm run dev       # dev server (hot reload) → http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

### Backend (`cd backend`)

```bash
npm install
npm run dev       # dev server with nodemon → http://localhost:3000
```

## Frontend Key Details

- **Tailwind CSS v4** is integrated via the Vite plugin (`@tailwindcss/vite`), not via PostCSS config. No `tailwind.config.js` is needed.
- Vue components use `<script setup>` SFC syntax exclusively.
- Entry point: `frontend/src/main.js` → mounts `App.vue` on `#app`.
- Components live in `frontend/src/components/`.
- `IdeaForm.vue` is the main component: textarea input + submit button + result display.
- API calls are centralized in `frontend/src/services/api.js` (`generatePlan(idea)`).
- Backend URL is configurable via `VITE_API_URL` env var (defaults to `http://localhost:3000`).

## Backend Key Details

- Entry point: `backend/src/index.js` — Express server on port 3000 (or `PORT` env var).
- Routes: `POST /api/generate`, `GET /health`.
- Claude integration: `backend/src/services/claude.js` — uses `@anthropic-ai/sdk` with model `claude-opus-4-6` and adaptive thinking.
- **Mock mode**: automatically activated when `ANTHROPIC_API_KEY` is absent or set to `"mock"`. Returns a structured fake response — no API credits needed for development.
- Config loaded via `dotenv` from `backend/.env`.
- Error handling middleware: `backend/src/middleware/errorHandler.js`.

## Environment Variables

### backend/.env

```env
ANTHROPIC_API_KEY=sk-ant-...   # omit or set to "mock" for mock mode
PORT=3000
```

### frontend/.env (optional)

```env
VITE_API_URL=http://localhost:3000
```

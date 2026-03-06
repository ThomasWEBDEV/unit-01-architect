# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UNIT-01 Architect is an AI-powered software design assistant (in French). It generates architectures, development plans, and technical specifications from a project idea, using the Claude API.

## Architecture

Monorepo with two top-level directories:

- `frontend/` — Vue.js 3 + Vite + Tailwind CSS 4
- `backend/` — Node.js + Express + Claude API (**not yet created**)

Target deployment: GCP Cloud Run.

## Commands

All commands run from their respective subdirectory.

### Frontend (`cd frontend`)

```bash
npm install       # install dependencies
npm run dev       # dev server (hot reload)
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

### Backend (`cd backend`) — to be scaffolded

```bash
npm install
npm run dev
```

## Frontend Key Details

- **Tailwind CSS v4** is integrated via the Vite plugin (`@tailwindcss/vite`), not via PostCSS config. No `tailwind.config.js` is needed.
- Vue components use `<script setup>` SFC syntax exclusively.
- Entry point: `frontend/src/main.js` → mounts `App.vue` on `#app`.
- Components live in `frontend/src/components/`.

## Backend (planned)

Will expose a REST API consumed by the frontend. Must integrate the Claude API (`@anthropic-ai/sdk`) to generate:
- Optimized system prompts
- Technical architecture (simple / medium / enterprise)
- Development plans with estimations
- Recommended stack with justifications
- Test strategy
- Obsolescence alerts on technologies

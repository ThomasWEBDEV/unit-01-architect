# UNIT-01 Architect

> Assistant de conception logicielle propulsé par IA — génère architectures, plans de développement et spécifications techniques à partir d'une simple idée de projet.

**Production :**
- Frontend : https://unit01-frontend-203722821617.europe-west1.run.app
- Backend : https://unit01-backend-203722821617.europe-west1.run.app

---

## Sommaire

1. [Présentation](#présentation)
2. [Fonctionnalités](#fonctionnalités)
3. [Stack technique](#stack-technique)
4. [Prérequis](#prérequis)
5. [Installation locale](#installation-locale)
6. [Configuration](#configuration)
7. [Développement](#développement)
8. [Tests](#tests)
9. [API Reference](#api-reference)
10. [Déploiement GCP Cloud Run](#déploiement-gcp-cloud-run)
11. [Structure du projet](#structure-du-projet)
12. [Licence](#licence)

---

## Présentation

UNIT-01 Architect est une application web full-stack qui exploite le modèle **Claude Opus 4.6** avec le mode *thinking adaptatif* pour produire, en quelques secondes, un plan de projet logiciel complet et structuré.

L'utilisateur saisit une idée de projet en langage naturel ; l'IA génère automatiquement :

- une **architecture technique** calibrée selon la complexité du projet ;
- un **plan de développement** phasé avec estimations ;
- une **stack recommandée** couche par couche ;
- des **spécifications prêtes à l'emploi** (system prompt optimisé pour Claude).

Le projet cible un déploiement **serverless sur GCP Cloud Run** avec deux services indépendants (frontend Nginx + backend Node.js).

---

## Fonctionnalités

### Génération de plan IA

| Fonctionnalité | Détail |
|---|---|
| System Prompt optimisé | Prompt prêt à coller dans Claude pour continuer le développement |
| Architecture technique | Adapatée au niveau de complexité : simple / medium / enterprise |
| Plan de développement | Structuré en phases avec estimations de temps |
| Stack recommandée | Par couche : frontend, backend, base de données, infrastructure |
| Stratégie de tests | Unitaires, intégration, E2E |
| Veille technologique | Technologies émergentes à surveiller pour le projet |
| Alertes obsolescence | Dépendances risquées avec niveau de risque (faible / moyen / élevé) |

### Interface utilisateur

| Fonctionnalité | Détail |
|---|---|
| Cartes dépliables | Les 7 sections du plan affichées en accordéon |
| Copier le System Prompt | Copie en un clic dans le presse-papiers |
| Export Markdown | Télécharge le plan complet au format `.md` |
| Export PDF | Génère un PDF paginé depuis le Markdown via jsPDF (sans dépendance DOM) |

### Mode mock (développement)

Le backend démarre automatiquement en **mode mock** si `ANTHROPIC_API_KEY` est absent ou vaut `mock`. Une réponse structurée fictive est retournée — aucun crédit API consommé pour développer et tester.

---

## Stack technique

| Couche | Technologie | Version |
|---|---|---|
| Frontend | Vue.js 3 + Vite | Vue 3.5 / Vite 7 |
| Styles | Tailwind CSS 4 (plugin Vite) | 4.2 |
| Rendu Markdown | marked | 17 |
| Export PDF | jsPDF | 4 |
| Backend | Node.js + Express | Node 22 / Express 4 |
| IA | Claude API — `claude-opus-4-6`, thinking adaptatif | SDK 0.78 |
| Tests | Jest + Supertest | Jest 30 |
| Conteneurisation | Docker multi-stage | — |
| Déploiement | GCP Cloud Run (europe-west1) | — |
| Reverse proxy | Nginx Alpine (frontend) | — |

---

## Prérequis

- **Node.js** ≥ 22 (LTS recommandé)
- **npm** ≥ 10
- Une clé API **Anthropic** — https://console.anthropic.com (optionnelle en mode mock)
- **Docker** (uniquement pour le déploiement)
- **gcloud CLI** (uniquement pour le déploiement GCP)

---

## Installation locale

```bash
# 1. Cloner le dépôt
git clone https://github.com/ThomasWEBDEV/unit-01-architect.git
cd unit-01-architect

# 2. Installer les dépendances backend
cd backend && npm install

# 3. Installer les dépendances frontend
cd ../frontend && npm install
```

---

## Configuration

### Backend — `backend/.env`

Créer le fichier à partir du modèle fourni :

```bash
cp backend/.env.example backend/.env
```

```env
# Clé API Anthropic — laisser vide ou mettre "mock" pour le mode mock
ANTHROPIC_API_KEY=sk-ant-...

# Port d'écoute du serveur Express
PORT=3000

# Environnement (development | production)
NODE_ENV=development
```

### Frontend — `frontend/.env` (optionnel)

Par défaut le frontend pointe sur `http://localhost:3000`. Pour pointer sur une autre URL :

```env
VITE_API_URL=http://localhost:3000
```

---

## Développement

Lancer les deux services en parallèle (dans deux terminaux) :

```bash
# Terminal 1 — Backend (http://localhost:3000)
cd backend
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
npm run dev
```

Le backend utilise `--watch` (Node.js natif) pour le rechargement automatique.
Le frontend utilise Vite avec HMR.

---

## Tests

Les tests unitaires et d'intégration sont dans `backend/src/__tests__/`.

```bash
cd backend
npm test
```

**Couverture actuelle : 17 tests**

| Fichier de test | Ce qui est testé |
|---|---|
| `claude.test.js` | Service Claude — mode mock, parsing de réponse, gestion d'erreurs |
| `generate.route.test.js` | Route `POST /api/generate` — validation, réponses, cas limites |

---

## API Reference

### `GET /health`

Vérifie l'état du serveur.

**Réponse 200**
```json
{
  "status": "ok",
  "mode": "production"
}
```

---

### `POST /api/generate`

Génère un plan de projet complet à partir d'une idée.

**Corps de la requête**
```json
{
  "idea": "Une app de gestion de tâches collaborative avec notifications en temps réel"
}
```

**Réponse 200**
```json
{
  "systemPrompt": "...",
  "architecture": { "level": "medium", "description": "...", "components": [] },
  "developmentPlan": { "phases": [] },
  "techStack": { "frontend": [], "backend": [], "database": [], "infrastructure": [] },
  "testingStrategy": { "unit": "...", "integration": "...", "e2e": "..." },
  "techWatch": { "technologies": [] },
  "obsolescenceAlerts": { "alerts": [] }
}
```

**Exemple cURL**
```bash
curl -X POST https://unit01-backend-203722821617.europe-west1.run.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{"idea": "Une app de gestion de tâches collaborative"}'
```

**Codes d'erreur**

| Code | Description |
|---|---|
| `400` | Champ `idea` manquant ou vide |
| `500` | Erreur serveur ou API Claude indisponible |

---

## Déploiement GCP Cloud Run

Les deux services sont déployés indépendamment sur **GCP Cloud Run** en région `europe-west1`.

### Prérequis GCP

```bash
# Authentification
gcloud auth login
gcloud config set project <PROJECT_ID>

# Activer les APIs nécessaires
gcloud services enable run.googleapis.com artifactregistry.googleapis.com
```

### Déployer le backend

```bash
cd backend

# Build et push de l'image Docker
gcloud builds submit --tag gcr.io/<PROJECT_ID>/unit01-backend

# Déployer sur Cloud Run
gcloud run deploy unit01-backend \
  --image gcr.io/<PROJECT_ID>/unit01-backend \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars ANTHROPIC_API_KEY=<votre_clé>,NODE_ENV=production
```

### Déployer le frontend

```bash
cd frontend

# Build avec l'URL du backend en production
gcloud builds submit \
  --tag gcr.io/<PROJECT_ID>/unit01-frontend \
  --build-arg VITE_API_URL=https://unit01-backend-203722821617.europe-west1.run.app

# Déployer sur Cloud Run
gcloud run deploy unit01-frontend \
  --image gcr.io/<PROJECT_ID>/unit01-frontend \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 80
```

### Build Docker local (optionnel)

```bash
# Backend
docker build -t unit01-backend ./backend
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=sk-ant-... unit01-backend

# Frontend
docker build \
  --build-arg VITE_API_URL=http://localhost:3000 \
  -t unit01-frontend ./frontend
docker run -p 8080:80 unit01-frontend
```

### URLs de production

| Service | URL |
|---|---|
| Frontend | https://unit01-frontend-203722821617.europe-west1.run.app |
| Backend | https://unit01-backend-203722821617.europe-west1.run.app |
| Health check | https://unit01-backend-203722821617.europe-west1.run.app/health |

---

## Structure du projet

```
unit-01-architect/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── IdeaForm.vue       # Composant principal (formulaire + affichage)
│   │   ├── services/
│   │   │   └── api.js             # Appels HTTP vers le backend
│   │   ├── App.vue
│   │   └── main.js
│   ├── Dockerfile                 # Build multi-stage : Vite → Nginx
│   ├── index.html
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── claude.test.js
│   │   │   └── generate.route.test.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   └── generate.js        # POST /api/generate
│   │   ├── services/
│   │   │   └── claude.js          # Intégration Claude API + mode mock
│   │   └── index.js               # Point d'entrée Express
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── CLAUDE.md
└── README.md
```

---

## Licence

MIT — voir [LICENSE](LICENSE)

# UNIT-01 Architect

Assistant de conception logicielle propulsé par IA. Génère des architectures, des plans de développement et des spécifications techniques à partir d'une simple idée de projet.

## Fonctionnalités

### Génération de plan

- Génération de System Prompt optimisé pour Claude
- Architecture technique adaptée (simple / medium / enterprise)
- Plan de développement structuré en phases avec estimations
- Stack recommandée par couche (frontend, backend, base de données, infrastructure)
- Stratégie de tests (unitaires, intégration, E2E)
- Veille technologique avec technologies à surveiller
- Alertes obsolescence avec niveau de risque (faible / moyen / élevé)

### Interface

- Affichage des 7 sections en cartes dépliables
- Bouton **Copier** le System Prompt dans le presse-papiers
- **Export Markdown** — télécharge le plan complet au format `.md`
- **Export PDF** — génère un PDF paginé directement depuis le Markdown (sans dépendance DOM)

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Vue.js 3, Vite, Tailwind CSS 4 |
| Backend | Node.js, Express |
| IA | Claude API (`claude-opus-4-6`, thinking adaptatif) |
| Déploiement | GCP Cloud Run |

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/ThomasWEBDEV/unit-01-architect.git
cd unit-01-architect

# Installer les dépendances frontend
cd frontend && npm install

# Installer les dépendances backend
cd ../backend && npm install
```

## Configuration

Créer un fichier `.env` dans `backend/` :

```env
ANTHROPIC_API_KEY=sk-ant-...   # Laisser vide ou mettre "mock" pour le mode mock
PORT=3000
```

Le backend démarre automatiquement en **mode mock** si `ANTHROPIC_API_KEY` est absent ou vaut `mock` — aucune clé API nécessaire pour développer.

## Développement

```bash
# Lancer le backend (depuis /backend)
npm run dev   # → http://localhost:3000

# Lancer le frontend (depuis /frontend)
npm run dev   # → http://localhost:5173
```

L'URL du backend est configurable côté frontend via `VITE_API_URL` (défaut : `http://localhost:3000`).

## API

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/health` | Vérification de l'état du serveur |
| `POST` | `/api/generate` | Génère un plan de projet à partir d'une idée |

### Exemple de requête

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"idea": "Une app de gestion de tâches collaborative"}'
```

## Déploiement

| Service | URL |
|---------|-----|
| Frontend | https://unit01-frontend-203722821617.europe-west1.run.app |
| Backend | https://unit01-backend-203722821617.europe-west1.run.app |

## Licence

MIT

# UNIT-01 Architect

Assistant de conception logicielle propulsé par IA. Génère des architectures, des plans de développement et des spécifications techniques à partir d'une simple idée de projet.

## Fonctionnalités

- Génération de System Prompt optimisé pour Claude
- Architecture technique adaptée (simple/medium/enterprise)
- Plan de développement structuré avec estimations
- Stack recommandée avec justifications
- Veille technologique en temps réel
- Stratégie de tests
- Alertes sur les technologies obsolètes

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Vue.js 3, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| IA | Claude API (Anthropic) |
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

## Développement
```bash
# Lancer le frontend (depuis /frontend)
npm run dev

# Lancer le backend (depuis /backend)
npm run dev
```

## Licence

MIT

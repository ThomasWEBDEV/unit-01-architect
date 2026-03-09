import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY;
const IS_MOCK = !apiKey || apiKey === 'mock';

const client = IS_MOCK ? null : new Anthropic({ apiKey });

const SYSTEM_PROMPT = `Tu es UNIT-01, un assistant expert en architecture logicielle et conception de systèmes.
À partir d'une idée de projet, tu génères une analyse complète et structurée.

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown, sans balises de code) respectant exactement cette structure :
{
  "systemPrompt": "Résumé du projet en une phrase",
  "architecture": {
    "type": "Simple | Medium | Enterprise",
    "description": "Description de l'architecture choisie et sa justification",
    "components": ["Composant 1", "Composant 2"]
  },
  "developmentPlan": [
    { "phase": 1, "title": "Titre de la phase", "description": "Description", "estimation": "X semaines" }
  ],
  "recommendedStack": {
    "frontend": ["technologie + justification"],
    "backend": ["technologie + justification"],
    "database": ["technologie + justification"],
    "infrastructure": ["technologie + justification"],
    "other": ["technologie + justification"]
  },
  "testStrategy": {
    "unit": "Description des tests unitaires et outils",
    "integration": "Description des tests d'intégration et outils",
    "e2e": "Description des tests E2E et outils",
    "other": "Autres pratiques (performance, sécurité, etc.)"
  },
  "techWatch": [
    { "technology": "Nom", "reason": "Pourquoi surveiller cette technologie" }
  ],
  "obsolescenceAlerts": [
    { "technology": "Nom", "risk": "low | medium | high", "recommendation": "Recommandation concrète" }
  ]
}

Réponds toujours en français. Sois précis et concis.`;

function mockResponse(projectIdea) {
  return {
    systemPrompt: `Application web collaborative de gestion de tâches — ${projectIdea} (mode mock)`,
    architecture: {
      type: 'Medium',
      description: 'Architecture web découplée avec API REST et base de données relationnelle. Adaptée à une équipe de 2–8 développeurs avec des besoins de collaboration en temps réel.',
      components: ['SPA Frontend', 'API REST Backend', 'Base de données PostgreSQL', 'WebSocket server', 'CDN statique'],
    },
    developmentPlan: [
      { phase: 1, title: 'Infrastructure & CI/CD', description: 'Mise en place des environnements, pipelines et structure du projet.', estimation: '1 semaine' },
      { phase: 2, title: 'Backend — API & authentification', description: 'Développement des endpoints REST, gestion des utilisateurs et OAuth.', estimation: '2 semaines' },
      { phase: 3, title: 'Frontend — Interface utilisateur', description: 'Développement des composants, vues et intégration API.', estimation: '2 semaines' },
      { phase: 4, title: 'Temps réel & notifications', description: 'Intégration WebSocket et système de notifications.', estimation: '1 semaine' },
      { phase: 5, title: 'Tests, optimisation & déploiement', description: 'Couverture de tests, performance et mise en production.', estimation: '1 semaine' },
    ],
    recommendedStack: {
      frontend: ['Vue.js 3 — écosystème mature, composition API', 'Vite — build ultra-rapide', 'Tailwind CSS — utilitaire, pas de CSS mort'],
      backend: ['Node.js 22 LTS — runtime JavaScript unifié', 'Express.js — léger et extensible', 'Socket.io — WebSocket avec fallback'],
      database: ['PostgreSQL 16 — relationnel fiable, JSON natif', 'Redis — cache et sessions'],
      infrastructure: ['GCP Cloud Run — serverless, scalable', 'GitHub Actions — CI/CD intégré'],
      other: ['Zod — validation de schémas', 'Vitest — tests unitaires rapides'],
    },
    testStrategy: {
      unit: 'Vitest (frontend) et Jest (backend) — couvrir les services et composants critiques, cible 80% de couverture.',
      integration: 'Supertest pour les routes API — tester les flux complets authentification → données.',
      e2e: 'Playwright — scénarios utilisateurs clés (création de tâche, collaboration, export).',
      other: 'Lighthouse CI pour la performance. OWASP ZAP pour les tests de sécurité en pré-production.',
    },
    techWatch: [
      { technology: 'Bun.js', reason: 'Runtime alternatif à Node.js avec performances significativement supérieures, adoption en hausse.' },
      { technology: 'Vite 7', reason: 'Migration vers Rolldown (Rust) prévue — changements potentiels de configuration.' },
      { technology: 'PostgreSQL 17', reason: 'Nouvelles fonctionnalités JSON et amélioration des performances de requêtes.' },
    ],
    obsolescenceAlerts: [
      { technology: 'Node.js < 20', risk: 'high', recommendation: 'Utiliser Node.js 22 LTS. Les versions < 20 sont en fin de vie ou sans support actif.' },
      { technology: 'Webpack 4', risk: 'high', recommendation: 'Migrer vers Vite ou Webpack 5. Webpack 4 n\'est plus maintenu.' },
      { technology: 'MongoDB (usage relationnel)', risk: 'medium', recommendation: 'Préférer PostgreSQL pour des données structurées et relationnelles.' },
      { technology: 'Vue.js 2', risk: 'high', recommendation: 'EOL depuis décembre 2023 — migrer vers Vue.js 3.' },
    ],
  };
}

export async function generateProjectPlan(projectIdea) {
  if (IS_MOCK) {
    return mockResponse(projectIdea);
  }

  const stream = client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 8096,
    thinking: { type: 'adaptive' },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Génère un plan complet pour le projet suivant : ${projectIdea}`,
      },
    ],
  });

  const message = await stream.finalMessage();
  const textContent = message.content.find((block) => block.type === 'text');
  const raw = textContent?.text ?? '{}';

  return JSON.parse(raw);
}

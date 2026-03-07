import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY;
const IS_MOCK = !apiKey || apiKey === 'mock';

const client = IS_MOCK ? null : new Anthropic({ apiKey });

const SYSTEM_PROMPT = `Tu es UNIT-01, un assistant expert en architecture logicielle et conception de systèmes.
À partir d'une idée de projet, tu génères :
- Une architecture technique adaptée (simple / medium / enterprise)
- Un plan de développement avec estimations
- Un stack technologique recommandé avec justifications
- Une stratégie de tests
- Des alertes sur les technologies à éviter ou obsolètes

Réponds toujours en français, de manière structurée et précise.`;

function mockResponse(projectIdea) {
  return `# Plan de projet — ${projectIdea} *(mode mock)*

## 1. Architecture recommandée
Architecture **Medium** — application web avec API REST et base de données relationnelle.

## 2. Stack technologique
- **Frontend** : Vue.js 3 + Vite + Tailwind CSS
- **Backend** : Node.js + Express
- **Base de données** : PostgreSQL
- **Déploiement** : GCP Cloud Run

## 3. Plan de développement
| Phase | Description | Estimation |
|-------|-------------|------------|
| 1 | Mise en place de l'infrastructure | 1 semaine |
| 2 | Développement du backend (API) | 2 semaines |
| 3 | Développement du frontend | 2 semaines |
| 4 | Tests & déploiement | 1 semaine |

## 4. Stratégie de tests
- Tests unitaires : Vitest (frontend), Jest (backend)
- Tests d'intégration : Supertest
- Tests E2E : Playwright

## 5. Points de vigilance
- Préférer PostgreSQL à MongoDB pour les données relationnelles
- Éviter les versions EOL de Node.js (< 18)

> ⚠️ Réponse simulée — configurez ANTHROPIC_API_KEY pour obtenir une vraie analyse.`;
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
  return textContent?.text ?? '';
}

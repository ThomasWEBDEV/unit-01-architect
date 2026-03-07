import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Tu es UNIT-01, un assistant expert en architecture logicielle et conception de systèmes.
À partir d'une idée de projet, tu génères :
- Une architecture technique adaptée (simple / medium / enterprise)
- Un plan de développement avec estimations
- Un stack technologique recommandé avec justifications
- Une stratégie de tests
- Des alertes sur les technologies à éviter ou obsolètes

Réponds toujours en français, de manière structurée et précise.`;

export async function generateProjectPlan(projectIdea) {
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

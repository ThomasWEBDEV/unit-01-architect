// ANTHROPIC_API_KEY n'est pas défini en environnement de test → mode mock automatique
import { generateProjectPlan } from '../services/claude.js';

describe('generateProjectPlan (mode mock)', () => {
  let plan;

  beforeAll(async () => {
    plan = await generateProjectPlan('application de gestion de tâches');
  });

  it('retourne un objet non nul', () => {
    expect(plan).toBeDefined();
    expect(typeof plan).toBe('object');
  });

  it('contient un systemPrompt avec "(mode mock)"', () => {
    expect(typeof plan.systemPrompt).toBe('string');
    expect(plan.systemPrompt).toContain('mode mock');
  });

  it('contient une architecture valide', () => {
    expect(plan.architecture).toBeDefined();
    expect(['Simple', 'Medium', 'Enterprise']).toContain(plan.architecture.type);
    expect(typeof plan.architecture.description).toBe('string');
    expect(Array.isArray(plan.architecture.components)).toBe(true);
    expect(plan.architecture.components.length).toBeGreaterThan(0);
  });

  it('contient un plan de développement avec des phases numérotées', () => {
    expect(Array.isArray(plan.developmentPlan)).toBe(true);
    expect(plan.developmentPlan.length).toBeGreaterThan(0);

    plan.developmentPlan.forEach((phase, index) => {
      expect(typeof phase.phase).toBe('number');
      expect(phase.phase).toBe(index + 1);
      expect(typeof phase.title).toBe('string');
      expect(typeof phase.description).toBe('string');
      expect(typeof phase.estimation).toBe('string');
    });
  });

  it('contient un stack technique avec les catégories attendues', () => {
    const stack = plan.recommendedStack;
    expect(stack).toBeDefined();
    for (const key of ['frontend', 'backend', 'database', 'infrastructure', 'other']) {
      expect(Array.isArray(stack[key])).toBe(true);
      expect(stack[key].length).toBeGreaterThan(0);
    }
  });

  it('contient une stratégie de tests avec les champs attendus', () => {
    const ts = plan.testStrategy;
    expect(ts).toBeDefined();
    for (const key of ['unit', 'integration', 'e2e', 'other']) {
      expect(typeof ts[key]).toBe('string');
      expect(ts[key].length).toBeGreaterThan(0);
    }
  });

  it('contient des entrées de veille technologique', () => {
    expect(Array.isArray(plan.techWatch)).toBe(true);
    expect(plan.techWatch.length).toBeGreaterThan(0);
    plan.techWatch.forEach((entry) => {
      expect(typeof entry.technology).toBe('string');
      expect(typeof entry.reason).toBe('string');
    });
  });

  it('contient des alertes d\'obsolescence avec des niveaux de risque valides', () => {
    expect(Array.isArray(plan.obsolescenceAlerts)).toBe(true);
    expect(plan.obsolescenceAlerts.length).toBeGreaterThan(0);
    plan.obsolescenceAlerts.forEach((alert) => {
      expect(typeof alert.technology).toBe('string');
      expect(['low', 'medium', 'high']).toContain(alert.risk);
      expect(typeof alert.recommendation).toBe('string');
    });
  });

  it('intègre l\'idée de projet dans le systemPrompt', async () => {
    const idea = 'plateforme de streaming vidéo';
    const result = await generateProjectPlan(idea);
    expect(result.systemPrompt).toContain(idea);
  });
});

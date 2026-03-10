import express from 'express';
import request from 'supertest';
import generateRouter from '../routes/generate.js';
import { errorHandler } from '../middleware/errorHandler.js';

// App de test isolée — pas de app.listen(), pas de dotenv
const app = express();
app.use(express.json());
app.use('/api/generate', generateRouter);
app.use(errorHandler);

describe('POST /api/generate', () => {
  describe('requêtes valides', () => {
    it('retourne 200 et un objet plan pour une idée valide', async () => {
      const res = await request(app)
        .post('/api/generate')
        .send({ idea: 'une application de e-commerce' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('plan');
      expect(typeof res.body.plan).toBe('object');
    });

    it('le plan contient les champs structurels attendus', async () => {
      const res = await request(app)
        .post('/api/generate')
        .send({ idea: 'réseau social pour développeurs' });

      const { plan } = res.body;
      expect(plan).toHaveProperty('systemPrompt');
      expect(plan).toHaveProperty('architecture');
      expect(plan).toHaveProperty('developmentPlan');
      expect(plan).toHaveProperty('recommendedStack');
      expect(plan).toHaveProperty('testStrategy');
      expect(plan).toHaveProperty('techWatch');
      expect(plan).toHaveProperty('obsolescenceAlerts');
    });

    it('supprime les espaces en début/fin de l\'idée', async () => {
      const res = await request(app)
        .post('/api/generate')
        .send({ idea: '   outil de monitoring   ' });

      expect(res.status).toBe(200);
      expect(res.body.plan.systemPrompt).toContain('outil de monitoring');
    });
  });

  describe('requêtes invalides', () => {
    it('retourne 400 si le champ "idea" est absent', async () => {
      const res = await request(app)
        .post('/api/generate')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('retourne 400 si "idea" est une chaîne vide', async () => {
      const res = await request(app)
        .post('/api/generate')
        .send({ idea: '' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/idea/i);
    });

    it('retourne 400 si "idea" ne contient que des espaces', async () => {
      const res = await request(app)
        .post('/api/generate')
        .send({ idea: '   ' });

      expect(res.status).toBe(400);
    });

    it('retourne 400 si "idea" n\'est pas une chaîne', async () => {
      const res = await request(app)
        .post('/api/generate')
        .send({ idea: 42 });

      expect(res.status).toBe(400);
    });

    it('retourne 400 si le body est null', async () => {
      const res = await request(app)
        .post('/api/generate')
        .send(null);

      expect(res.status).toBe(400);
    });
  });
});

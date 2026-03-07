import { Router } from 'express';
import { generateProjectPlan } from '../services/claude.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { idea } = req.body;

    if (!idea || typeof idea !== 'string' || !idea.trim()) {
      return res.status(400).json({ error: 'Le champ "idea" est requis.' });
    }

    const plan = await generateProjectPlan(idea.trim());
    res.json({ plan });
  } catch (err) {
    next(err);
  }
});

export default router;

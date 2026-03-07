import { Router } from 'express';

const router = Router();

router.post('/', (_req, res) => {
  res.json({ message: 'Route generate fonctionnelle' });
});

export default router;

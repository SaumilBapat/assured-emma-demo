import { Router } from 'express';
const router = Router();

router.get('/active-numbers', async (req: any, res: any) => {
  try {
    res.json({ message: 'Active numbers endpoint' });
  } catch (error: any) {
    console.error('Active numbers error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
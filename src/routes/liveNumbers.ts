import { Router } from 'express';
const router = Router();

router.get('/live-numbers', async (req: any, res: any) => {
  try {
    res.json({ message: 'Live numbers endpoint' });
  } catch (error: any) {
    console.error('Live numbers error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
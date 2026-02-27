import { Router } from 'express';
const router = Router();

router.get('/outbound-message', async (req: any, res: any) => {
  try {
    res.json({ message: 'Outbound message endpoint' });
  } catch (error: any) {
    console.error('Outbound message error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
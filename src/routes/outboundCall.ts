import { Router } from 'express';
const router = Router();

router.get('/outbound-call', async (req: any, res: any) => {
  try {
    res.json({ message: 'Outbound call endpoint' });
  } catch (error: any) {
    console.error('Outbound call error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
import { Router } from 'express';
import { activeConversations, recentActivity } from './conversationRelay';

const router = Router();

router.get('/stats', async (req: any, res: any) => {
  try {
    const stats = {
      activeConversations: activeConversations.size,
      totalRecentActivity: recentActivity.size,
      timestamp: new Date().toISOString()
    };
    res.json(stats);
  } catch (error: any) {
    console.error('Stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
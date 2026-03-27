import { Router } from 'express';
import { handleChat } from '../controllers/ai.controller';

const router = Router();

router.post('/chat', handleChat);

export default router;

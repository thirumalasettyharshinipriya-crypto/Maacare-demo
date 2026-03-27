import { Router } from 'express';
import { sendSMSAlert } from '../controllers/alert.controller';

const router = Router();

router.post('/sms', sendSMSAlert);

export default router;

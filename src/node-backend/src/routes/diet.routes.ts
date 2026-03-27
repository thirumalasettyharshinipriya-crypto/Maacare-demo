import { Router } from 'express';
import { getDietPlan } from '../controllers/diet.controller';

const router = Router();

router.get('/:patientId', getDietPlan);

export default router;

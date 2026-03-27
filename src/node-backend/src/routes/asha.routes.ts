import { Router } from 'express';
import { getPatients, updatePatientRisk } from '../controllers/asha.controller';

const router = Router();

router.get('/patients', getPatients);
router.patch('/patients/:id/risk', updatePatientRisk);

export default router;

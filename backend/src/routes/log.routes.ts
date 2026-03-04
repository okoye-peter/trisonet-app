import { Router } from 'express';
import { getLogs, clearLogs } from '../controllers/log.controller';
import { protect } from '../middlewares/auth';

const router = Router();

// Assuming only authenticated users can view/clear logs, and ideally, only admins.
// For now, protecting it simply:
router.use(protect);

router.get('/', getLogs);
router.delete('/', clearLogs);

export const logRouter = router;

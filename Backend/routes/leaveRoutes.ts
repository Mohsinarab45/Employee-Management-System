import { Router } from 'express';
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} from '../controllers/leaveController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.post('/', applyLeave);
router.get('/my-leaves', getMyLeaves);

// Admin only routes
router.get('/admin/all', requireRole(['ADMIN']), getAllLeaves);
router.patch('/admin/:id/status', requireRole(['ADMIN']), updateLeaveStatus);

export default router;

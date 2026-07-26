import { Router } from 'express';
import {
  checkIn,
  startBreak,
  endBreak,
  checkOut,
  getMyAttendance,
  getAllAttendance,
} from '../controllers/attendanceController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.post('/check-in', checkIn);
router.post('/break/start', startBreak);
router.post('/break/end', endBreak);
router.post('/check-out', checkOut);
router.get('/my-history', getMyAttendance);

// Admin view all attendance
router.get('/admin/all', requireRole(['ADMIN']), getAllAttendance);

export default router;

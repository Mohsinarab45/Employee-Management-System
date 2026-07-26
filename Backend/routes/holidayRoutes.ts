import { Router } from 'express';
import { getHolidays, createHoliday, deleteHoliday } from '../controllers/holidayController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getHolidays);

// Admin only routes
router.post('/admin', requireRole(['ADMIN']), createHoliday);
router.delete('/admin/:id', requireRole(['ADMIN']), deleteHoliday);

export default router;

import { Router } from 'express';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/adminController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Protect all admin routes with authentication and ADMIN role check
router.use(authenticateToken, requireRole(['ADMIN']));

router.get('/employees', getEmployees);
router.post('/employees', createEmployee);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);

export default router;

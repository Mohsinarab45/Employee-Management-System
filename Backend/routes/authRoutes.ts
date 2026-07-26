import { Router } from 'express';
import {
  login,
  register,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
} from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', authenticateToken, changePassword);
router.put('/profile', authenticateToken, updateProfile);
router.get('/me', authenticateToken, getMe);

export default router;

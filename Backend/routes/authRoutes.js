import express from 'express';
import { register, login, logout, getMe, resetPassword } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.post("/reset-password", resetPassword);

export default router;

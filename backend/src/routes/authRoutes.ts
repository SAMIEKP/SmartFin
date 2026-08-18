import { Router } from 'express';
import { body } from 'express-validator';
import { register, verifyRegistration, login, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { emailKey, rateLimit, requestKey, verificationKey } from '../middleware/authRateLimit';

const router = Router();

// Validation middleware
const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['user', 'provider']).withMessage('Role must be user or provider'),
  body('verificationChannel').isIn(['email', 'sms', 'call', 'whatsapp']).withMessage('A verification channel is required')
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', rateLimit('register-ip', 5, 60 * 60 * 1000, requestKey), registerValidation, register);
router.post('/verify-registration', rateLimit('verify-code', 5, 15 * 60 * 1000, verificationKey), verifyRegistration);
router.post('/login', rateLimit('login-account', 10, 15 * 60 * 1000, emailKey), loginValidation, login);
router.get('/profile', authenticateToken, getProfile);

export default router;

import { Router } from 'express';
import { updateProfile, getApplications, getLoanProducts } from '../controllers/userController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authenticateToken);

// User profile routes
router.put('/profile', updateProfile);
router.get('/applications', getApplications);
router.get('/products', getLoanProducts);

export default router;

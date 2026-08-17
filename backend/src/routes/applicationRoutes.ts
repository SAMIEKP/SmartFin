import { Router } from 'express';
import { createApplication, getProviderApplications, updateApplicationStatus, getApplicationDetails } from '../controllers/applicationController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// All application routes require authentication
router.use(authenticateToken);

// Provider routes
router.get('/provider/all', requireRole(['provider']), getProviderApplications);
router.put('/:applicationId/status', requireRole(['provider']), updateApplicationStatus);

// User routes
router.post('/', requireRole(['user']), createApplication);
router.get('/:applicationId', getApplicationDetails);

export default router;

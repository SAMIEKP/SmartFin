import { Router } from 'express';
import { createApplication, getProviderApplications, updateApplicationStatus, getApplicationDetails } from '../controllers/applicationController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// All application routes require authentication
router.use(authenticateToken);

// User routes
router.post('/', createApplication);
router.get('/:applicationId', getApplicationDetails);

// Provider routes
router.get('/provider/all', requireRole(['provider']), getProviderApplications);
router.put('/:applicationId/status', requireRole(['provider']), updateApplicationStatus);

export default router;

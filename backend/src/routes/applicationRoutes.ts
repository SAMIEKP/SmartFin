import { Router } from 'express';
import { createApplication, getProviderApplications, updateApplicationStatus, getApplicationDetails, getUserNotifications, markNotificationRead, getUserLoans, getApplicationMedia } from '../controllers/applicationController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// All application routes require authentication
router.use(authenticateToken);

// Provider routes
router.get('/provider/all', requireRole(['provider']), getProviderApplications);
router.get('/media/:mediaId', getApplicationMedia);
router.put('/:applicationId/status', requireRole(['provider']), updateApplicationStatus);

// User routes
router.post('/', requireRole(['user']), createApplication);
router.get('/user/notifications', requireRole(['user']), getUserNotifications);
router.put('/user/notifications/:notificationId/read', requireRole(['user']), markNotificationRead);
router.get('/user/loans', requireRole(['user']), getUserLoans);
router.get('/:applicationId', getApplicationDetails);

export default router;

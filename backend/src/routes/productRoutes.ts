import { Router } from 'express';
import { createProduct, getProviderProducts, updateProduct, deleteProduct } from '../controllers/productController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// All product routes require authentication and provider role
router.use(authenticateToken);
router.use(requireRole(['provider']));

router.post('/', createProduct);
router.get('/', getProviderProducts);
router.put('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);

export default router;

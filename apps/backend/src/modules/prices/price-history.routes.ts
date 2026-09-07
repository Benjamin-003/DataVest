import { Router } from 'express';
import { priceHistoryController } from './price-history.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/:symbol', priceHistoryController.getHistory);

export default router;
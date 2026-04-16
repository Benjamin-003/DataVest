import { Router } from 'express';
import { subscriptionController } from './subscription.controller';

const router = Router();

router.get('/', subscriptionController.getAll);

export default router;

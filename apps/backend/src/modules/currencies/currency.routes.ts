import { Router } from 'express';
import { currencyController } from './currency.controller';

const router = Router();

router.get('/', currencyController.getAll);

export default router;

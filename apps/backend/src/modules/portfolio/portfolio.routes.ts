import { Router } from 'express';
import { portfolioController } from './portfolio.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { addPositionSchema } from './portfolio.schema';

const router = Router();

router.use(authenticate);

router.get('/',       portfolioController.getAll);
router.post('/',      validate(addPositionSchema), portfolioController.add);
router.delete('/:id', portfolioController.remove);

export default router;
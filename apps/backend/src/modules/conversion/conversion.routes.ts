import { Router } from 'express';
import { conversionController } from './conversion.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createConversionSchema } from './conversion.schema';

const router = Router();

// Toutes les routes conversion sont protégées
router.use(authenticate);

router.post('/', validate(createConversionSchema), conversionController.create);
router.get('/', conversionController.findAll);
router.get('/:id', conversionController.findOne);
router.delete('/:id', conversionController.delete);

export default router;
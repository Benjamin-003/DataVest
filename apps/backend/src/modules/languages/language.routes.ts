import { Router } from 'express';
import { languageController } from './language.controller';

const router = Router();

router.get('/', languageController.getAll);

export default router;

import { Router } from 'express';
import { articleController } from './article.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Route protégée — nécessite un token valide
// :url = URL du flux RSS encodée en base64
router.get('/:url', authenticate, articleController.getArticles);

export default router;

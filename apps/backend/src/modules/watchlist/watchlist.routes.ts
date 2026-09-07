import { Router } from 'express';
import { watchlistController } from './watchlist.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { addItemSchema } from './watchlist.schema';

const router = Router();

router.use(authenticate); // toutes les routes sont protégées

router.get('/',      watchlistController.getAll);
router.post('/',     validate(addItemSchema), watchlistController.add);
router.delete('/:id', watchlistController.remove);

export default router;
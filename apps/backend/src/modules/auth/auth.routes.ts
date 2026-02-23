import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { changePasswordSchema, checkEmailSchema, loginSchema, refreshSchema, registerSchema, updateMeSchema } from './auth.schema';

const router = Router();

// Routes publiques — accessibles sans token
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshSchema), authController.refresh);
router.post('/check-email', validate(checkEmailSchema), authController.checkEmail);

// Routes protégées — nécessitent un token valide via authenticate
router.post('/logout', authenticate, authController.logout);
router.patch('/me', authenticate, validate(updateMeSchema), authController.updateMe);
router.delete('/me', authenticate, authController.deleteMe);
router.get('/me', authenticate, authController.getLoggedUser);
router.patch('/password', authenticate, validate(changePasswordSchema), authController.changePassword);
export default router;
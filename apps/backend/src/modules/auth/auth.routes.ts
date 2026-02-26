import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { changePasswordSchema, checkEmailSchema, forgotPasswordSchema, loginSchema, refreshSchema, registerSchema, resetPasswordSchema, updateMeSchema, verifyEmailSchema, verifyTwoFactorSchema } from './auth.schema';

const router = Router();

// Routes publiques — accessibles sans token
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshSchema), authController.refresh);
router.post('/check-email', validate(checkEmailSchema), authController.checkEmail);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.post('/verify-email', validate(verifyEmailSchema), authController.verifyEmail);

// Routes protégées — nécessitent un token valide via authenticate
router.post('/logout', authenticate, authController.logout);
router.patch('/me', authenticate, validate(updateMeSchema), authController.updateMe);
router.delete('/me', authenticate, authController.deleteMe);
router.get('/me', authenticate, authController.getLoggedUser);
router.patch('/password', authenticate, validate(changePasswordSchema), authController.changePassword);
router.post('/2fa/verify', validate(verifyTwoFactorSchema), authController.verifyTwoFactor);
export default router;
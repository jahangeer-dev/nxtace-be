import { Router } from 'express';
import { AuthController } from '@/infrastructure/http/controllers/AuthController.js';
import { authenticateJWT } from '@/infrastructure/http/middlewares/auth.js';

const authController = new AuthController();
const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);

authRouter.post('/logout', authenticateJWT, authController.logout);
authRouter.get('/me', authenticateJWT, authController.me);

export { authRouter };

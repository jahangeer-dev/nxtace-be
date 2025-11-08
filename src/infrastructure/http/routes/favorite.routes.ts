import { Router } from 'express';
import { FavoriteController } from '../controllers/FavoriteController.js';
import { authenticateJWT } from '../middlewares/auth.js';

const favoriteRouter = Router();

// All routes require authentication
favoriteRouter.use(authenticateJWT);

favoriteRouter.get('/', FavoriteController.getFavorites);
favoriteRouter.post('/:templateId', FavoriteController.addToFavorites);
favoriteRouter.delete('/:templateId', FavoriteController.removeFromFavorites);

export { favoriteRouter };

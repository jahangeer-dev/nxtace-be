import type { Request, Response, NextFunction } from 'express';
import { favoriteService } from '@/application/favorites/FavoriteService.js';
import { AsyncHandler } from '@/infrastructure/http/middlewares/asyncHandler.js';
import { SuccessResponse, CreatedResponse } from '@/infrastructure/http/responses/ApiResponse.js';
import { 
  BadRequestError, 
  ResourceNotFoundError, 
  ConflictError 
} from '@/shared/utils/errors/ApiError.js';

export class FavoriteController {
  static getFavorites = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = req.user as any;
    const favorites = await favoriteService.getFavoritesByUser(user._id.toString());
    new SuccessResponse('Favorites retrieved successfully', favorites).send(res);
  });

  static addToFavorites = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = req.user as any;
    const { templateId } = req.params;

    if (!templateId) {
      throw new BadRequestError('Template ID is required');
    }

    try {
      await favoriteService.addToFavorites(user._id.toString(), templateId);
      new CreatedResponse('Template added to favorites').send(res);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Template not found') {
          throw new ResourceNotFoundError(error.message);
        }
        if (error.message === 'Template already in favorites') {
          throw new ConflictError(error.message);
        }
      }
      throw error;
    }
  });

  static removeFromFavorites = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = req.user as any;
    const { templateId } = req.params;

    if (!templateId) {
      throw new BadRequestError('Template ID is required');
    }

    try {
      await favoriteService.removeFromFavorites(user._id.toString(), templateId);
      new SuccessResponse('Template removed from favorites').send(res);
    } catch (error) {
      if (error instanceof Error && error.message === 'Favorite not found') {
        throw new ResourceNotFoundError(error.message);
      }
      throw error;
    }
  });
}

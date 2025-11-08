import { favoriteRepository } from '@/infrastructure/database/repositories/FavoriteRepository.js';
import { templateRepository } from '@/infrastructure/database/repositories/TemplateRepository.js';
import type { ITemplate } from '@/domain/entities/Template.js';

class FavoriteService {
  private static instance: FavoriteService;

  public static getInstance(): FavoriteService {
    if (!FavoriteService.instance) {
      FavoriteService.instance = new FavoriteService();
    }
    return FavoriteService.instance;
  }

  async getFavoritesByUser(userId: string): Promise<ITemplate[]> {
    return await favoriteRepository.findByUserId(userId);
  }

  async addToFavorites(userId: string, templateId: string): Promise<void> {
    // Check if template exists
    const template = await templateRepository.findById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Check if already favorited
    const isFav = await favoriteRepository.isFavorite(userId, templateId);
    if (isFav) {
      throw new Error('Template already in favorites');
    }

    await favoriteRepository.addFavorite(userId, templateId);
  }

  async removeFromFavorites(userId: string, templateId: string): Promise<void> {
    const removed = await favoriteRepository.removeFavorite(userId, templateId);
    if (!removed) {
      throw new Error('Favorite not found');
    }
  }

  async isFavorite(userId: string, templateId: string): Promise<boolean> {
    return await favoriteRepository.isFavorite(userId, templateId);
  }
}

export const favoriteService = FavoriteService.getInstance();

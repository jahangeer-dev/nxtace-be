import { Favorite, type IFavorite } from '@/domain/entities/Favorite.js';
import type { IFavoriteRepository } from '@/domain/interfaces/IFavoriteRepository.js';
import type { ITemplate } from '@/domain/entities/Template.js';

export class FavoriteRepository implements IFavoriteRepository {
  async findByUserId(userId: string): Promise<ITemplate[]> {
    const favorites = await Favorite.find({ userId })
      .populate('templateId')
      .sort({ createdAt: -1 })
      .exec();
    
    return favorites.map((fav: any) => fav.templateId).filter(Boolean);
  }

  async addFavorite(userId: string, templateId: string): Promise<IFavorite> {
    const favorite = new Favorite({ userId, templateId });
    return await favorite.save();
  }

  async removeFavorite(userId: string, templateId: string): Promise<boolean> {
    const result = await Favorite.findOneAndDelete({ userId, templateId }).exec();
    return result !== null;
  }

  async isFavorite(userId: string, templateId: string): Promise<boolean> {
    const favorite = await Favorite.findOne({ userId, templateId }).exec();
    return favorite !== null;
  }
}

export const favoriteRepository = new FavoriteRepository();

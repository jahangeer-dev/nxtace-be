import type { IFavorite } from "../entities/Favorite.js";
import type { ITemplate } from "../entities/Template.js";

export interface IFavoriteRepository {
  findByUserId(userId: string): Promise<ITemplate[]>;
  addFavorite(userId: string, templateId: string): Promise<IFavorite>;
  removeFavorite(userId: string, templateId: string): Promise<boolean>;
  isFavorite(userId: string, templateId: string): Promise<boolean>;
}

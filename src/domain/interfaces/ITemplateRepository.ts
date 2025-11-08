import type { ITemplate } from "../entities/Template.js";

export interface ITemplateRepository {
  findAll(): Promise<ITemplate[]>;
  findById(id: string): Promise<ITemplate | null>;
  findByCategory(category: string): Promise<ITemplate[]>;
  search(query: string): Promise<ITemplate[]>;
  create(templateData: Partial<ITemplate>): Promise<ITemplate>;
  update(id: string, templateData: Partial<ITemplate>): Promise<ITemplate | null>;
  delete(id: string): Promise<boolean>;
}

import { Template, type ITemplate } from '@/domain/entities/Template.js';
import type { ITemplateRepository } from '@/domain/interfaces/ITemplateRepository.js';

export class TemplateRepository implements ITemplateRepository {
  async findAll(): Promise<ITemplate[]> {
    return await Template.find({}).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<ITemplate | null> {
    return await Template.findById(id).exec();
  }

  async findByCategory(category: string): Promise<ITemplate[]> {
    return await Template.find({ category }).sort({ createdAt: -1 }).exec();
  }

  async search(query: string): Promise<ITemplate[]> {
    return await Template.find({
      $text: { $search: query }
    }).sort({ createdAt: -1 }).exec();
  }

  async create(templateData: Partial<ITemplate>): Promise<ITemplate> {
    const template = new Template(templateData);
    return await template.save();
  }

  async update(id: string, templateData: Partial<ITemplate>): Promise<ITemplate | null> {
    return await Template.findByIdAndUpdate(
      id,
      { $set: templateData },
      { new: true, runValidators: true }
    ).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await Template.findByIdAndDelete(id).exec();
    return result !== null;
  }
}

export const templateRepository = new TemplateRepository();

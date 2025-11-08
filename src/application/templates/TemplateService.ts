import { templateRepository } from '@/infrastructure/database/repositories/TemplateRepository.js';
import type { ITemplate } from '@/domain/entities/Template.js';

class TemplateService {
  private static instance: TemplateService;

  public static getInstance(): TemplateService {
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService();
    }
    return TemplateService.instance;
  }

  async getAllTemplates(): Promise<ITemplate[]> {
    return await templateRepository.findAll();
  }

  async getTemplateById(id: string): Promise<ITemplate> {
    const template = await templateRepository.findById(id);
    if (!template) {
      throw new Error('Template not found');
    }
    return template;
  }

  async getTemplatesByCategory(category: string): Promise<ITemplate[]> {
    return await templateRepository.findByCategory(category);
  }

  async searchTemplates(query: string): Promise<ITemplate[]> {
    return await templateRepository.search(query);
  }
}

export const templateService = TemplateService.getInstance();

import { Router } from 'express';
import { TemplateController } from '../controllers/TemplateController.js';

const templateRouter = Router();

// Public routes
templateRouter.get('/', TemplateController.getAllTemplates);
templateRouter.get('/search', TemplateController.searchTemplates);
templateRouter.get('/:id', TemplateController.getTemplateById);

export { templateRouter };

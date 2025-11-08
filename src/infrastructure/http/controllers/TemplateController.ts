import type { Request, Response, NextFunction } from 'express';
import { templateService } from '@/application/templates/TemplateService.js';
import { AsyncHandler } from '@/infrastructure/http/middlewares/asyncHandler.js';
import { SuccessResponse } from '@/infrastructure/http/responses/ApiResponse.js';
import { BadRequestError, ResourceNotFoundError } from '@/shared/utils/errors/ApiError.js';
import { ITemplate } from '@/domain/entities/Template';

export class TemplateController {
    static getAllTemplates = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
        const templates = await templateService.getAllTemplates();
        new SuccessResponse('Templates retrieved successfully', templates).send(res);
    });

    static getTemplateById = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;

        if (!id) {
            throw new BadRequestError('Template ID is required');
        }

        try {
            const template = await templateService.getTemplateById(id);
            new SuccessResponse('Template retrieved successfully', template).send(res);
        } catch (error) {
            if (error instanceof Error && error.message === 'Template not found') {
                throw new ResourceNotFoundError(error.message);
            }
            throw error;
        }
    });

    static searchTemplates = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { q, category } = req.query;
        let templates;
        console.log("hello");

        if (category) {
            templates = await templateService.getTemplatesByCategory(category as string);
        } else if (q) {
            templates = await templateService.searchTemplates(q as string);
        } else {
            templates = await templateService.getAllTemplates();
        }

        new SuccessResponse('Templates retrieved successfully', templates).send(res);
    });


}

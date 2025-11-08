import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { templateRouter } from './template.routes.js';
import { favoriteRouter } from './favorite.routes.js';

const indexRouter = Router();

indexRouter.get('/health', (req: any, res: any) => {
  res.json({
    success: true,
    message: 'Template Store API is running',
    timestamp: new Date().toISOString()
  });
});

indexRouter.use('/auth', authRouter);
indexRouter.use('/templates', templateRouter);
indexRouter.use('/favorites', favoriteRouter);

export { indexRouter };

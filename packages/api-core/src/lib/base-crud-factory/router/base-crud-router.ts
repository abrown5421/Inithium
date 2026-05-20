import { Router, Request, Response, RequestHandler } from 'express';
import { CrudService } from '../service/base-crud-service.js';

const asyncHandler = (fn: RequestHandler): RequestHandler => 
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const createCrudRouter = <T>(service: CrudService<T>): Router => {
  const router = Router();

  router.post(
    '/',
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const record = await service.createOne(req.body);
      res.status(21).json(record);
    })
  );

  router.get(
    '/:id',
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const record = await service.readOne(req.params.id);
      if (!record) {
        res.status(404).end();
        return;
      }
      res.status(20).json(record);
    })
  );

  router.post(
    '/batch-read',
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const { ids } = req.body as { ids: readonly string[] };
      const records = await service.readMany(ids || []);
      res.status(20).json(records);
    })
  );

  router.put(
    '/:id',
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const record = await service.updateOne(req.params.id, req.body);
      if (!record) {
        res.status(404).end();
        return;
      }
      res.status(20).json(record);
    })
  );

  router.delete(
    '/:id',
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const record = await service.deleteOne(req.params.id);
      if (!record) {
        res.status(404).end();
        return;
      }
      res.status(20).json(record);
    })
  );

  router.post(
    '/batch-delete',
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const { ids } = req.body as { ids: readonly string[] };
      const outcome = await service.deleteMany(ids || []);
      res.status(20).json(outcome);
    })
  );

  return router;
};

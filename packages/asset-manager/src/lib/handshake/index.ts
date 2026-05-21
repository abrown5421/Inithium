import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import { TOKEN_TTL_MS, PRESIGNED_PATH_PREFIX } from '../config/index.js';
import { registerToken, consumeToken, peekToken } from './token-store.js';
import { writeFileStream } from '../adapter/index.js';
import type { UploadToken } from '../types/index.js';

type FinalizeAsset = (params: {
  uploadId:     string;
  storageKey:   string;
  mimeType:     string;
  originalName: string;
  size:         number;
  sizeBytes:    number;
}) => Promise<{ asset_id: string }>;

export const createHandshakeRouter = (finalizeAsset: FinalizeAsset): Router => {
  const router = Router();

  router.post(
    '/intent',
    (req: Request, res: Response) => {
      const { filename, mimeType, size } = req.body as {
        filename: string;
        mimeType: string;
        size:     number;
      };

      if (!filename || !mimeType || !size) {
        res.status(400).json({
          error: 'filename, mimeType and size are required',
          code:  'MISSING_FIELDS',
        });
        return;
      }

      const uploadId   = crypto.randomUUID();
      const ext        = filename.includes('.') ? filename.slice(filename.lastIndexOf('.')) : '';
      const storageKey = `${crypto.randomUUID()}${ext}`;
      const expiresAt  = Date.now() + TOKEN_TTL_MS;

      const token: UploadToken = {
        uploadId,
        storageKey,
        mimeType,
        originalName: filename,
        size,
        expiresAt,
      };

      registerToken(token);

      res.status(201).json({
        uploadId,
        storageKey,
        uploadUrl: `${PRESIGNED_PATH_PREFIX}/${uploadId}`,
        expiresAt: new Date(expiresAt).toISOString(),
      });
    },
  );
  
  router.get(
    '/intent/:uploadId',
    (req: Request, res: Response) => {
      const token = peekToken(req.params.uploadId);
      if (!token) {
        res.status(404).json({ error: 'Token not found or expired', code: 'TOKEN_NOT_FOUND' });
        return;
      }
      res.json({
        uploadId:     token.uploadId,
        storageKey:   token.storageKey,
        mimeType:     token.mimeType,
        originalName: token.originalName,
        size:         token.size,
        expiresAt:    new Date(token.expiresAt).toISOString(),
      });
    },
  );

  router.put(
    `${PRESIGNED_PATH_PREFIX}/:uploadId`,
    async (req: Request, res: Response, next: NextFunction) => {
      const token = consumeToken(req.params.uploadId);

      if (!token) {
        res.status(410).json({ error: 'Upload token expired or not found', code: 'TOKEN_EXPIRED' });
        return;
      }

      const writeResult = await writeFileStream(req, token.storageKey, token.mimeType);

      if (!writeResult.ok) {
        res.status(500).json({ error: writeResult.error, code: writeResult.code });
        return;
      }

      try {
        const { asset_id } = await finalizeAsset({
          uploadId:     token.uploadId,
          storageKey:   token.storageKey,
          mimeType:     token.mimeType,
          originalName: token.originalName,
          size:         token.size,
          sizeBytes:    writeResult.data.sizeBytes,
        });

        res.status(201).json({
          asset_id,
          storageKey:   token.storageKey,
          category:     writeResult.data.category,
          originalName: token.originalName,
          sizeBytes:    writeResult.data.sizeBytes,
        });
      } catch (err) {
        next(err);
      }
    },
  );

  return router;
};

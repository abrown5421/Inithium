import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

process.env['ASSETS_ROOT'] = path.resolve(__dirname, 'assets');

import express from 'express';
import cors from 'cors';
import { connectDB, errorHandler } from '@inithium/api-core';
import {
  usersRouter,
  pagesRouter,
  assetsRouter,
  assetsService,
  authRouter,
} from '@inithium/api-collections';
import { AssetModel } from '@inithium/api-collections';
import { createAssetManager } from '@inithium/asset-manager';

const host     = process.env['HOST']      ?? 'localhost';
const port     = process.env['PORT']      ? Number(process.env['PORT']) : 3000;
const mongoUri = process.env['MONGO_URI'] ?? 'mongodb://localhost:27017/my-app';

const allowedOrigins = process.env['CORS_ORIGINS']
  ? process.env['CORS_ORIGINS'].split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:4200'];

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin "${origin}" is not allowed`));
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api/users',  usersRouter);
app.use('/api/pages',  pagesRouter);
app.use('/api/assets', assetsRouter);
app.use('/api/auth', authRouter);

app.get('/', (_req, res) => {
  res.send({ message: 'Hello API' });
});

async function bootstrap() {
  await connectDB(mongoUri);

  const assetManager = await createAssetManager({
    assetsService: {
      createOne: (data)   => assetsService.createOne(data),
      readOne:   (id)     => assetsService.readOne(id),
      findOne:   (filter) => AssetModel.findOne(filter).lean().exec(),
    },
  });

  app.use('/api/asset-manager', assetManager.handshakeRouter);

  app.use('/api/assets', assetManager.proxyRouter);

  app.listen(port, host, () => {
    console.log(`[ ready  ] http://${host}:${port}`);
    console.log(`[ assets ] ${process.env['ASSETS_ROOT']}`);
  });

  app.use(errorHandler);
}

bootstrap();
import express from 'express';
import { connectDB } from '@inithium/api-core';
import { usersRouter, pagesRouter, assetsRouter } from '@inithium/api-collections';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const mongoUri =
  process.env.MONGO_URI ??
  'mongodb://localhost:27017/my-app';

const app = express();

app.use(express.json());

app.use('/api/users',  usersRouter);
app.use('/api/pages',  pagesRouter);
app.use('/api/assets', assetsRouter);

app.get('/', (_req, res) => {
  res.send({ message: 'Hello API' });
});

async function bootstrap() {
  await connectDB(mongoUri);

  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
}

bootstrap();

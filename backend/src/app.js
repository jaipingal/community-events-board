import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import healthRoutes from './routes/health.routes.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ name: 'Community Events Board API', health: '/api/v1/health' });
});

app.use('/api/v1/health', healthRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

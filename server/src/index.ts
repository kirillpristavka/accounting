// server/src/index.ts
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import organizationsRouter from './routes/organizations';
import nomenclatureRouter from './routes/nomenclature';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Роуты
app.use('/api/organizations', organizationsRouter(prisma));
app.use('/api/nomenclature', nomenclatureRouter(prisma));

const port = 4000;
app.listen(port, () => {
  console.log(`🚀 API running on http://localhost:${port}`);
});
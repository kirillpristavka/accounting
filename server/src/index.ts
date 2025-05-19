// server/src/index.ts
import express from 'express';
import cors from 'cors';
import { PrismaClient, OrgType, PhysicalType } from '@prisma/client';
import organizationsRouter from './routes/organizations';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// даём роуты
app.use('/api/organizations', organizationsRouter(prisma));

const port = 4000;
app.listen(port, () => {
  console.log(`🚀 API running on http://localhost:${port}`);
});
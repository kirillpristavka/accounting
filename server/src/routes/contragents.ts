// server/src/routes/contragents.ts
import { Router, Request, Response } from 'express';
import type { PrismaClient } from '@prisma/client';

export default (prisma: PrismaClient) => {
  const router = Router();

  // GET /api/contragents
  router.get('/', async (_req: Request, res: Response) => {
    try {
      const data = await prisma.contragent.findMany();
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Не удалось получить контрагентов' });
    }
  });

  // POST /api/contragents
  router.post('/', async (req: Request, res: Response) => {
    try {
      const { name, phone, email } = req.body;
      const created = await prisma.contragent.create({
        data: { name, phone, email },
      });
      res.status(201).json(created);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Не удалось создать контрагента' });
    }
  });

  // GET /api/contragents/:id
  router.get('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      const item = await prisma.contragent.findUnique({ where: { id } });
      if (!item) return res.status(404).json({ error: 'Контрагент не найден' });
      res.json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Не удалось загрузить контрагента' });
    }
  });

  // PUT /api/contragents/:id
  router.put('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      const { name, phone, email } = req.body;
      const updated = await prisma.contragent.update({
        where: { id },
        data: { name, phone, email },
      });
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Не удалось обновить контрагента' });
    }
  });

  // DELETE /api/contragents/:id
  router.delete('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      await prisma.contragent.delete({ where: { id } });
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Не удалось удалить контрагента' });
    }
  });

  return router;
};

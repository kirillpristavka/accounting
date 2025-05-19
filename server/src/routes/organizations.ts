// server/src/routes/organizations.ts
import { Router, Request, Response } from 'express';
import { OrgType, PhysicalType, PrismaClient } from '@prisma/client';

export default (prisma: PrismaClient) => {
  const router = Router();

  // POST /api/organizations
  router.post('/', async (req: Request, res: Response) => {
    try {
      const {
        lastName,
        firstName,
        middleName,
        name,
        prefix,
        inn,
        taxation,
      } = req.body;

      // транзакционно создаём Organization + SelfEmployed
      const result = await prisma.$transaction(async tx => {
        const org = await tx.organization.create({
          data: {
            type: OrgType.PHYSICAL,
            physicalType: PhysicalType.SELF_EMPLOYED,
            name,
            prefix,
            inn,
            taxation,
          },
        });
        await tx.selfEmployed.create({
          data: {
            orgId: org.id,
            lastName,
            firstName,
            middleName,
          },
        });
        return org;
      });

      res.status(201).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot create organization' });
    }
  });

  // GET /api/organizations
  router.get('/', async (_req: Request, res: Response) => {
    try {
      // Берём из БД все организации с полем physicalType
      const orgs = await prisma.organization.findMany({
        select: {
          id: true,
          name: true,
          inn: true,
          type: true,
          physicalType: true,
        },
      });

      // Трансформируем в удобный формат
      const data = orgs.map(org => {
        let statusText: string;
        if (org.type === OrgType.PHYSICAL) {
          statusText =
            org.physicalType === PhysicalType.SELF_EMPLOYED
              ? 'Самозанятый'
              : 'ИП';
        } else {
          statusText = 'Юридическое лицо';
        }
        return {
          id: org.id,
          name: org.name,
          inn: org.inn,
          status: statusText,
        };
      });

      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Не удалось получить организации' });
    }
  });

  // DELETE /api/organizations/:id
  router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id);
    await prisma.organization.delete({ where: { id } });
    res.sendStatus(204);
  });

  return router;
};
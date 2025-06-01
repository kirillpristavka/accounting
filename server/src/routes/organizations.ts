// server/src/routes/organizations.ts

import { Router, Request, Response } from 'express';
import { OrgType, PhysicalType, PrismaClient } from '@prisma/client';

export default (prisma: PrismaClient) => {
  const router = Router();

  // POST /api/organizations — создать новую организацию
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

      // Транзакционно создаём Organization + SelfEmployed (если ФЛ)
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

  // GET /api/organizations — получить весь список организаций
  router.get('/', async (_req: Request, res: Response) => {
    try {
      const orgs = await prisma.organization.findMany({
        select: {
          id: true,
          name: true,
          inn: true,
          type: true,
          physicalType: true,
        },
      });

      const data = orgs.map((org) => {
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

  // GET /api/organizations/:id — получить одну организацию по ID
  router.get('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Неверный ID' });
      return;
    }

    try {
      const org = await prisma.organization.findUnique({
        where: { id },
        include: {
          selfEmployed: true, // подтягиваем данные ФИО, если это ФЛ
        },
      });

      if (!org) {
        res.status(404).json({ error: 'Организация не найдена' });
        return;
      }

      // Формируем ответ в привычном виде для фронтенда
      const responseData: any = {
        id: org.id,
        type: org.type,        // 'PHYSICAL' или 'LEGAL'
        name: org.name,
        prefix: org.prefix,
        inn: org.inn,
        taxation: org.taxation,
      };

      if (org.type === OrgType.PHYSICAL && org.selfEmployed) {
        Object.assign(responseData, {
          physicalType: org.physicalType, // 'SELF_EMPLOYED' или 'IP'
          lastName: org.selfEmployed.lastName,
          firstName: org.selfEmployed.firstName,
          middleName: org.selfEmployed.middleName,
        });
      }

      res.json(responseData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Не удалось загрузить организацию' });
    }
  });

  // PUT /api/organizations/:id — обновить организацию по ID
  router.put('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Неверный ID' });
      return;
    }

    try {
      const {
        type,
        physicalType, // 'SELF_EMPLOYED' | 'IP' (если ФЛ)
        lastName,
        firstName,
        middleName,
        name,
        prefix,
        inn,
        taxation,
      } = req.body;

      // Обновляем основные поля организации
      const updatedOrg = await prisma.organization.update({
        where: { id },
        data: {
          type,
          physicalType: type === OrgType.PHYSICAL ? physicalType : null,
          name,
          prefix,
          inn,
          taxation,
        },
      });

      // Если это ФЛ, обновляем или создаём запись selfEmployed
      if (type === OrgType.PHYSICAL) {
        await prisma.selfEmployed.upsert({
          where: { orgId: id },
          update: {
            lastName,
            firstName,
            middleName,
          },
          create: {
            orgId: id,
            lastName,
            firstName,
            middleName,
          },
        });
      } else {
        // Если это ЮЛ, удаляем любые записи selfEmployed (опционально)
        await prisma.selfEmployed.deleteMany({ where: { orgId: id } });
      }

      res.json(updatedOrg);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Не удалось обновить организацию' });
    }
  });

  // DELETE /api/organizations/:id — удалить организацию по ID
  router.delete('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Неверный ID' });
      return;
    }

    try {
      await prisma.organization.delete({ where: { id } });
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Не удалось удалить организацию' });
    }
  });

  return router;
};
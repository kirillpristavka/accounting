// server/src/routes/nomenclature.ts
import { Router, Request, Response } from 'express'
import type { PrismaClient } from '@prisma/client'

export default (prisma: PrismaClient) => {
  const router = Router()

  // POST /api/nomenclature — создать новую запись
  router.post('/', async (req: Request, res: Response) => {
    try {
      const {
        type,
        name,
        fullName,
        marking,
        article,
        group,
        unit,
        vat,
        country,
        manufacturer,
        comment,
        hideInLists,
      } = req.body

      const created = await prisma.nomenclature.create({
        data: {
          type,
          name,
          fullName,
          marking,
          article,
          group,
          unit,
          vat,
          country,
          manufacturer,
          comment,
          hideInLists: Boolean(hideInLists),
        },
      })

      res.status(201).json(created)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Не удалось создать номенклатуру' })
    }
  })

  // GET /api/nomenclature — получить весь список
  router.get('/', async (_req: Request, res: Response) => {
    try {
      const items = await prisma.nomenclature.findMany()
      res.json(items)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Не удалось получить список номенклатуры' })
    }
  })

  // GET /api/nomenclature/:id — получить одну запись по ID
  router.get('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    try {
      const item = await prisma.nomenclature.findUnique({
        where: { id },
      })
      if (!item) {
        res.status(404).json({ error: 'Номенклатура не найдена' })
      }
      res.json(item)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Не удалось загрузить номенклатуру' })
    }
  })

  // PUT /api/nomenclature/:id — обновить запись по ID
  router.put('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    try {
      const {
        type,
        name,
        fullName,
        marking,
        article,
        group,
        unit,
        vat,
        country,
        manufacturer,
        comment,
        hideInLists,
      } = req.body

      const updated = await prisma.nomenclature.update({
        where: { id },
        data: {
          type,
          name,
          fullName,
          marking,
          article,
          group,
          unit,
          vat,
          country,
          manufacturer,
          comment,
          hideInLists: Boolean(hideInLists),
        },
      })

      res.json(updated)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Не удалось обновить номенклатуру' })
    }
  })

  // DELETE /api/nomenclature/:id — удалить запись по ID
  router.delete('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    try {
      await prisma.nomenclature.delete({ where: { id } })
      res.sendStatus(204)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Не удалось удалить номенклатуру' })
    }
  })

  return router
}
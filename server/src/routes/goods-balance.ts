import { Router, Request, Response } from 'express'
import type { PrismaClient } from '@prisma/client'

export default (prisma: PrismaClient) => {
  const router = Router()

  // POST /api/goods-balance — сохранить остатки товаров
  router.post('/', async (req, res) => {
    try {
      const { date, orgId, comment, responsible, rows } = req.body

      const maxNumber = await prisma.goodsBalanceDocument.aggregate({
        _max: { number: true },
      })

      const nextNumber = (maxNumber._max.number ?? 0) + 1

      const created = await prisma.goodsBalanceDocument.create({
        data: {
          number: nextNumber,
          date: new Date(date),
          orgId,
          comment,
          responsible,
          entries: {
            create: rows.map((row: any) => ({
              account: row.account,
              name: row.name,
              warehouse: row.warehouse,
              quantity: parseFloat(row.quantity || '0'),
              cost: parseFloat(row.cost || '0'),
              country: row.country,
              customs: row.customs,
              unit: row.unit,
            }))
          }
        }
      })

      res.status(201).json({ id: created.id, number: created.number })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Ошибка при сохранении документа' })
    }
  })

  router.get('/by-account/:accountCode', async (req: Request, res: Response) => {
    try {
      const { accountCode } = req.params

      const documents = await prisma.goodsBalanceDocument.findMany({
        where: {
          entries: { some: { account: accountCode } }
        },
        include: {
          organization: true
        },
        orderBy: { date: 'asc' }
      })

      res.json(documents)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Не удалось загрузить документы' })
    }
  })

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const document = await prisma.goodsBalanceDocument.findUnique({
        where: { id: Number(req.params.id) },
        include: {
          entries: true,
          organization: true,
        },
      })

      if (!document) res.status(404).json({ error: 'Документ не найден' })

      res.json(document)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Ошибка при получении документа' })
    }
  })

  // PUT /api/goods-balance/:id — обновить существующий документ
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params
      const { date, orgId, comment, responsible, rows } = req.body

      // Удалим старые записи
      await prisma.goodsBalanceEntry.deleteMany({
        where: { documentId: Number(id) }
      })

      // Обновим сам документ
      const updated = await prisma.goodsBalanceDocument.update({
        where: { id: Number(id) },
        data: {
          date: new Date(date),
          orgId,
          comment,
          responsible,
          entries: {
            create: rows.map((row: any) => ({
              account: row.account,
              name: row.name,
              warehouse: row.warehouse,
              quantity: parseFloat(row.quantity || '0'),
              cost: parseFloat(row.cost || '0'),
              country: row.country,
              customs: row.customs,
              unit: row.unit,
            }))
          }
        }
      })

      res.json({ success: true, id: updated.id })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Ошибка при обновлении документа' })
    }
  })

  router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id)
    try {
      await prisma.goodsBalanceDocument.delete({ where: { id } })
      res.status(204).end()
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Ошибка удаления документа' })
    }
  })

  return router
}
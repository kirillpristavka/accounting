import { Router, Request, Response } from 'express'
import type { PrismaClient } from '@prisma/client'

export default (prisma: PrismaClient) => {
  const router = Router()

  // POST /api/goods-balance — сохранить остатки товаров
  router.post('/', async (req: Request, res: Response) => {
    try {
      const { organizationId, date, rows, responsible, comment } = req.body

      // Пример: сохраняем каждый товар в таблицу goodsBalanceRow
      for (const row of rows) {
        await prisma.goodsBalanceRow.create({
          data: {
            organizationId,
            date: new Date(date),
            account: row.account,
            name: row.name,
            warehouse: row.warehouse,
            quantity: Number(row.quantity || 0),
            cost: Number(row.cost || 0),
            country: row.country,
            customs: row.customs,
            unit: row.unit,
            responsible,
            comment,
          },
        })
      }

      res.status(201).json({ success: true })
    } catch (err) {
      console.error('Ошибка при сохранении остатков:', err)
      res.status(500).json({ error: 'Ошибка при сохранении остатков' })
    }
  })

  return router
}
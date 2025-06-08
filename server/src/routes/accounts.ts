// server/src/routes/accounts.ts

import { Router, Request, Response } from 'express'
import type { PrismaClient } from '@prisma/client'

export default (prisma: PrismaClient) => {
  const router = Router()

  /**
   * GET /api/accounts
   * Параметр offBalance (true|false) — основные или забалансовые
   * Пример: /api/accounts?offBalance=false
   */
  router.get('/', async (req: Request, res: Response) => {
    try {
      const offBalance = req.query.offBalance === 'true'
      const rows = await prisma.account.findMany({
        where: { offBalance },
        orderBy: { code: 'asc' },
      })

      // Вернём только поля, которые нужны клиенту
      const result = rows.map(r => ({
        account: r.code,
        name:    r.name,
      }))

      res.json(result)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Не удалось получить список счетов' })
    }
  })

  return router
}
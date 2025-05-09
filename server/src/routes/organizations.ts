// server/src/routes/organizations.ts
import { Router } from "express";
import { Organization } from "../models/Organization";

const router = Router();

// POST /api/organizations — сохранить новую организацию
router.post("/", async (req, res) => {
  try {
    const {
      view,
      status,
      surname,
      name,
      patronymic,
      fullName,
      prefix,
      inn,
      ogrnip,
      registrationDate,
      certificate,
      certificateDate,
      bank,
      address,
      taxInspection,
      pension,
      fss,
      statistics,
    } = req.body;

    const org = await Organization.create({
      view,
      status,
      surname,
      name,
      patronymic,
      fullName,
      prefix,
      inn,
      ogrnip,
      // Преобразуем пустые или невалидные даты в null
      registrationDate: registrationDate ? registrationDate : null,
      certificate,
      certificateDate:  certificateDate  ? certificateDate  : null,

      bank,
      address,
      taxInspection,
      pension,
      fss,
      statistics,
    });

    return res.status(201).json(org);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/organizations — вернуть список
router.get("/", async (_, res) => {
  const list = await Organization.findAll({ order: [["createdAt", "DESC"]] });
  res.json(list);
});

export default router;

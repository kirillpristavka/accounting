import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./db";
import organizationRouter from "./routes/organizations";

dotenv.config();

const app = express();
app.use(express.json());

// Проброс роутов
app.use("/api/organizations", organizationRouter);

// Подключаемся к БД и стартуем сервер
const PORT = process.env.PORT || 4000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
});

import express from "express";
import cors from "cors";
import { sequelize } from "./config/database";
import authRoutes from "./routes/authRoutes";
import "./custom";


export const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

sequelize.sync().then(() => {
  console.log("Database connected!");
});

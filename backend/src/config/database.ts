import { Sequelize } from "sequelize-typescript";
import { User } from "../models/User";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize({
  database: "real_estate_db",
  username: "postgres",
  password: "1572001",
  host: "127.0.0.1",
  dialect: "postgres",
  models: [User],
});

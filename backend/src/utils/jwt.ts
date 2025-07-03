import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "your_secret_key", {
    expiresIn: "1h",
  });
};

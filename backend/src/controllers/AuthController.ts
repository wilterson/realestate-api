import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { signupSchema } from "../validations/authValidations";
import { generateToken } from "../utils/jwt";

dotenv.config();

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = await signupSchema.validate(req.body, {
      abortEarly: false,
    });

    const { name, email, password, termsAccepted, phoneNumber, about } =
      validatedData;

    // Split name into firstName and lastName
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "User with this email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      termsAccepted,
      firstName,
      lastName,
      phoneNumber,
      about,
    });

    const token = generateToken(user.id.toString());

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const errors = error.inner.map((err: any) => ({
        field: err.path,
        message: err.message,
      }));

      res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
      return;
    }

    res.status(500).json({ error: "Error creating user" });
  }
};

// 📌 2️⃣ Login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Search new user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // ✅ Create JWT
    const token = generateToken(user.id.toString());
    res.json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

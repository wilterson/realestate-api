import request from "supertest";
import express from "express";
import { signup, login } from "../../controllers/AuthController";
import { User } from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mock dependencies
jest.mock("../../models/User");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockUser = User as jest.MockedClass<typeof User>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;

// Fix Sequelize model mocking
beforeEach(() => {
  (mockUser.findOne as any).mockResolvedValue(null);
  (mockUser.create as any).mockResolvedValue({});
  (mockBcrypt.hash as any).mockResolvedValue("hashedPassword");
  (mockBcrypt.compare as any).mockResolvedValue(true);
  (mockJwt.sign as any).mockReturnValue("mockToken");
});

describe("AuthController", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.post("/signup", signup);
    app.post("/login", login);

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe("POST /signup", () => {
    const validSignupData = {
      name: "John Doe",
      email: "john@example.com",
      password: "Password123",
      termsAccepted: true,
      phoneNumber: "+1234567890",
      about: "A test user",
    };

    it("should successfully register a new user", async () => {
      // Mock User.findOne to return null (user doesn't exist)
      (mockUser.findOne as any).mockResolvedValue(null);

      // Mock bcrypt.hash
      (mockBcrypt.hash as any).mockResolvedValue("hashedPassword");

      // Mock User.create
      const createdUser = {
        id: 1,
        ...validSignupData,
        firstName: "John",
        lastName: "Doe",
        password: "hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (mockUser.create as any).mockResolvedValue(createdUser);

      // Mock jwt.sign
      (mockJwt.sign as any).mockReturnValue("mockToken");

      const response = await request(app)
        .post("/signup")
        .send(validSignupData)
        .expect(201);

      expect(response.body).toEqual({
        message: "User registered successfully",
        token: "mockToken",
        user: {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          firstName: "John",
          lastName: "Doe",
          phoneNumber: "+1234567890",
          about: "A test user",
        },
      });

      expect(mockUser.findOne).toHaveBeenCalledWith({
        where: { email: "john@example.com" },
      });
      expect(mockBcrypt.hash).toHaveBeenCalledWith("Password123", 10);
      expect(mockUser.create).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        password: "hashedPassword",
        termsAccepted: true,
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "+1234567890",
        about: "A test user",
      });
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { id: "1" },
        expect.any(String),
        {
          expiresIn: "1h",
        }
      );
    });

    it("should correctly split name with multiple words", async () => {
      // Mock User.findOne to return null (user doesn't exist)
      (mockUser.findOne as any).mockResolvedValue(null);

      // Mock bcrypt.hash
      (mockBcrypt.hash as any).mockResolvedValue("hashedPassword");

      // Mock User.create
      const createdUser = {
        id: 1,
        name: "John Michael Doe",
        email: "john@example.com",
        firstName: "John",
        lastName: "Michael Doe",
        password: "hashedPassword",
        termsAccepted: true,
        phoneNumber: "+1234567890",
        about: "A test user",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (mockUser.create as any).mockResolvedValue(createdUser);

      // Mock jwt.sign
      (mockJwt.sign as any).mockReturnValue("mockToken");

      const response = await request(app)
        .post("/signup")
        .send({
          name: "John Michael Doe",
          email: "john@example.com",
          password: "Password123",
          termsAccepted: true,
          phoneNumber: "+1234567890",
          about: "A test user",
        })
        .expect(201);

      expect(mockUser.create).toHaveBeenCalledWith({
        name: "John Michael Doe",
        email: "john@example.com",
        password: "hashedPassword",
        termsAccepted: true,
        firstName: "John",
        lastName: "Michael Doe",
        phoneNumber: "+1234567890",
        about: "A test user",
      });
    });

    it("should handle names with extra whitespace", async () => {
      // Mock User.findOne to return null (user doesn't exist)
      (mockUser.findOne as any).mockResolvedValue(null);

      // Mock bcrypt.hash
      (mockBcrypt.hash as any).mockResolvedValue("hashedPassword");

      // Mock User.create
      const createdUser = {
        id: 1,
        name: "  John   Doe  ",
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
        password: "hashedPassword",
        termsAccepted: true,
        phoneNumber: "+1234567890",
        about: "A test user",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (mockUser.create as any).mockResolvedValue(createdUser);

      // Mock jwt.sign
      (mockJwt.sign as any).mockReturnValue("mockToken");

      const response = await request(app)
        .post("/signup")
        .send({
          name: "  John   Doe  ",
          email: "john@example.com",
          password: "Password123",
          termsAccepted: true,
          phoneNumber: "+1234567890",
          about: "A test user",
        })
        .expect(201);

      expect(mockUser.create).toHaveBeenCalledWith({
        name: "  John   Doe  ",
        email: "john@example.com",
        password: "hashedPassword",
        termsAccepted: true,
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "+1234567890",
        about: "A test user",
      });
    });

    it("should return 400 if user already exists", async () => {
      // Mock User.findOne to return existing user
      const existingUser = { id: 1, email: "john@example.com" };
      (mockUser.findOne as any).mockResolvedValue(existingUser);

      const response = await request(app)
        .post("/signup")
        .send(validSignupData)
        .expect(400);

      expect(response.body).toEqual({
        error: "User with this email already exists",
      });

      expect(mockUser.findOne).toHaveBeenCalledWith({
        where: { email: "john@example.com" },
      });
      expect(mockUser.create).not.toHaveBeenCalled();
    });

    it("should return 400 for validation errors", async () => {
      const invalidData = {
        name: "", // Invalid: empty name
        email: "invalid-email", // Invalid: not a valid email
        password: "123", // Invalid: too short
        termsAccepted: false, // Invalid: must be true
      };

      const response = await request(app)
        .post("/signup")
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBe("Validation failed");
      expect(response.body.details).toBeDefined();
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("should return 400 for invalid name format (single word)", async () => {
      const invalidData = {
        name: "John", // Invalid: only one word
        email: "john@example.com",
        password: "Password123",
        termsAccepted: true,
      };

      const response = await request(app)
        .post("/signup")
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBe("Validation failed");
      expect(response.body.details).toBeDefined();
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("should return 500 on database error", async () => {
      // Mock User.findOne to throw an error
      (mockUser.findOne as any).mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .post("/signup")
        .send(validSignupData)
        .expect(500);

      expect(response.body).toEqual({
        error: "Error creating user",
      });
    });
  });

  describe("POST /login", () => {
    const validLoginData = {
      email: "john@example.com",
      password: "Password123",
    };

    it("should successfully login a user", async () => {
      // Mock User.findOne to return existing user
      const existingUser = {
        id: 1,
        email: "john@example.com",
        password: "hashedPassword",
        name: "John Doe",
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "+1234567890",
        about: "A test user",
      };
      (mockUser.findOne as any).mockResolvedValue(existingUser);

      // Mock bcrypt.compare to return true
      (mockBcrypt.compare as any).mockResolvedValue(true);

      // Mock jwt.sign
      (mockJwt.sign as any).mockReturnValue("mockToken");

      const response = await request(app)
        .post("/login")
        .send(validLoginData)
        .expect(200);

      expect(response.body).toEqual({
        message: "Login successful!",
        token: "mockToken",
      });

      expect(mockUser.findOne).toHaveBeenCalledWith({
        where: { email: "john@example.com" },
      });
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        "Password123",
        "hashedPassword"
      );
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { id: "1" },
        expect.any(String),
        {
          expiresIn: "1h",
        }
      );
    });

    it("should return 401 for non-existent user", async () => {
      // Mock User.findOne to return null
      (mockUser.findOne as any).mockResolvedValue(null);

      const response = await request(app)
        .post("/login")
        .send(validLoginData)
        .expect(401);

      expect(response.body).toEqual({
        error: "Invalid credentials",
      });

      expect(mockUser.findOne).toHaveBeenCalledWith({
        where: { email: "john@example.com" },
      });
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
    });

    it("should return 401 for incorrect password", async () => {
      // Mock User.findOne to return existing user
      const existingUser = {
        id: 1,
        email: "john@example.com",
        password: "hashedPassword",
      };
      (mockUser.findOne as any).mockResolvedValue(existingUser);

      // Mock bcrypt.compare to return false
      (mockBcrypt.compare as any).mockResolvedValue(false);

      const response = await request(app)
        .post("/login")
        .send(validLoginData)
        .expect(401);

      expect(response.body).toEqual({
        error: "Invalid credentials",
      });

      expect(mockUser.findOne).toHaveBeenCalledWith({
        where: { email: "john@example.com" },
      });
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        "Password123",
        "hashedPassword"
      );
      expect(mockJwt.sign).not.toHaveBeenCalled();
    });

    it("should return 500 on database error", async () => {
      // Mock User.findOne to throw an error
      (mockUser.findOne as any).mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .post("/login")
        .send(validLoginData)
        .expect(500);

      expect(response.body).toEqual({
        error: "Error logging in",
      });
    });
  });
});

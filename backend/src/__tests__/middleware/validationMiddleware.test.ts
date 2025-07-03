import request from "supertest";
import express from "express";
import { validateRequest } from "../../middleware/validationMiddleware";
import * as yup from "yup";

describe("ValidationMiddleware", () => {
  let app: express.Application;

  const testSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    age: yup
      .number()
      .positive("Age must be positive")
      .required("Age is required"),
  });

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.post("/test", validateRequest(testSchema), (req, res) => {
      res.json({ success: true, data: req.body });
    });
  });

  describe("validateRequest", () => {
    it("should pass validation for valid data", async () => {
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        age: 25,
      };

      const response = await request(app)
        .post("/test")
        .send(validData)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: validData,
      });
    });

    it("should return 400 for missing required fields", async () => {
      const invalidData = {
        name: "John Doe",
        // Missing email and age
      };

      const response = await request(app)
        .post("/test")
        .send(invalidData)
        .expect(400);

      expect(response.body).toEqual({
        error: "Validation failed",
        details: [
          { field: "email", message: "Email is required" },
          { field: "age", message: "Age is required" },
        ],
      });
    });

    it("should return 400 for invalid email format", async () => {
      const invalidData = {
        name: "John Doe",
        email: "invalid-email",
        age: 25,
      };

      const response = await request(app)
        .post("/test")
        .send(invalidData)
        .expect(400);

      expect(response.body).toEqual({
        error: "Validation failed",
        details: [{ field: "email", message: "Invalid email" }],
      });
    });

    it("should return 400 for invalid age (negative)", async () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        age: -5,
      };

      const response = await request(app)
        .post("/test")
        .send(invalidData)
        .expect(400);

      expect(response.body).toEqual({
        error: "Validation failed",
        details: [{ field: "age", message: "Age must be positive" }],
      });
    });

    it("should return 400 for multiple validation errors", async () => {
      const invalidData = {
        name: "", // Empty name
        email: "invalid-email", // Invalid email
        age: -5, // Negative age
      };

      const response = await request(app)
        .post("/test")
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBe("Validation failed");
      expect(response.body.details).toHaveLength(3);
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          { field: "name", message: "Name is required" },
          { field: "email", message: "Invalid email" },
          { field: "age", message: "Age must be positive" },
        ])
      );
    });

    it("should return 500 for non-validation errors", async () => {
      // Create a schema that will throw a non-validation error
      const problematicSchema = yup.object({
        name: yup.string().test("error", "Test error", () => {
          throw new Error("Unexpected error");
        }),
      });

      const testApp = express();
      testApp.use(express.json());
      testApp.post("/test", validateRequest(problematicSchema), (req, res) => {
        res.json({ success: true });
      });

      const response = await request(testApp)
        .post("/test")
        .send({ name: "test" })
        .expect(500);

      expect(response.body).toEqual({
        error: "Internal server error during validation",
      });
    });
  });
});

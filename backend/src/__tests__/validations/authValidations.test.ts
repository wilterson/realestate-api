import { signupSchema } from "../../validations/authValidations";

describe("AuthValidations", () => {
  describe("signupSchema", () => {
    const validSignupData = {
      name: "John Doe",
      email: "john@example.com",
      password: "Password123",
      termsAccepted: true,
      phoneNumber: "+1234567890",
      about: "A test user",
    };

    it("should validate correct signup data", async () => {
      const result = await signupSchema.validate(validSignupData);
      expect(result).toEqual(validSignupData);
    });

    it("should require name field", async () => {
      const invalidData = { ...validSignupData, name: "" };

      await expect(signupSchema.validate(invalidData)).rejects.toThrow(
        "Name must be at least 2 characters"
      );
    });

    it("should require email field", async () => {
      const invalidData = { ...validSignupData, email: "" };

      await expect(signupSchema.validate(invalidData)).rejects.toThrow(
        "Email is required"
      );
    });

    it("should validate email format", async () => {
      const invalidData = { ...validSignupData, email: "invalid-email" };

      await expect(signupSchema.validate(invalidData)).rejects.toThrow(
        "Invalid email format"
      );
    });

    it("should require password field", async () => {
      const invalidData = { ...validSignupData, password: "" };

      await expect(signupSchema.validate(invalidData)).rejects.toThrow(
        "Password must be at least 8 characters"
      );
    });

    it("should validate password minimum length", async () => {
      const invalidData = { ...validSignupData, password: "123" };

      await expect(signupSchema.validate(invalidData)).rejects.toThrow(
        "Password must be at least 8 characters"
      );
    });

    it("should validate password complexity", async () => {
      const invalidData = { ...validSignupData, password: "password123" }; // No uppercase

      await expect(signupSchema.validate(invalidData)).rejects.toThrow(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      );
    });

    it("should require termsAccepted to be true", async () => {
      const invalidData = { ...validSignupData, termsAccepted: false };

      await expect(signupSchema.validate(invalidData)).rejects.toThrow(
        "You must accept the terms and conditions"
      );
    });

    it("should validate name format (must contain at least first and last name)", async () => {
      const invalidData = { ...validSignupData, name: "John" }; // Only one word

      await expect(signupSchema.validate(invalidData)).rejects.toThrow(
        "Name must contain at least first and last name"
      );
    });

    it("should validate name format with multiple words", async () => {
      const validData = { ...validSignupData, name: "John Michael Doe" };
      const result = await signupSchema.validate(validData);
      expect(result.name).toBe("John Michael Doe");
    });

    it("should validate phone number format when provided", async () => {
      const invalidData = { ...validSignupData, phoneNumber: "invalid-phone" };

      await expect(signupSchema.validate(invalidData)).rejects.toThrow(
        "Invalid phone number format"
      );
    });

    it("should accept valid phone number formats", async () => {
      const validPhoneNumbers = [
        "+1234567890",
        "123-456-7890",
        "(123) 456-7890",
        "123 456 7890",
      ];

      for (const phone of validPhoneNumbers) {
        const data = { ...validSignupData, phoneNumber: phone };
        const result = await signupSchema.validate(data);
        expect(result.phoneNumber).toBe(phone);
      }
    });

    it("should validate about field length when provided", async () => {
      const longAbout = "a".repeat(1001); // Too long
      const invalidData = { ...validSignupData, about: longAbout };

      await expect(signupSchema.validate(invalidData)).rejects.toThrow(
        "About section must be less than 1000 characters"
      );
    });

    it("should work with minimal required data", async () => {
      const minimalData = {
        name: "John Doe",
        email: "john@example.com",
        password: "Password123",
        termsAccepted: true,
      };

      const result = await signupSchema.validate(minimalData);
      expect(result).toEqual(minimalData);
    });

    it("should handle multiple validation errors", async () => {
      const invalidData = {
        name: "", // Empty name
        email: "invalid-email", // Invalid email
        password: "123", // Too short
        termsAccepted: false, // Must be true
      };

      try {
        await signupSchema.validate(invalidData, { abortEarly: false });
        fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.name).toBe("ValidationError");
        expect(error.inner).toHaveLength(7);

        const errorMessages = error.inner.map((err: any) => err.message);
        expect(errorMessages).toContain("Name must be at least 2 characters");
        expect(errorMessages).toContain("Name is required");
        expect(errorMessages).toContain(
          "Name must contain at least first and last name"
        );
        expect(errorMessages).toContain("Invalid email format");
        expect(errorMessages).toContain(
          "Password must be at least 8 characters"
        );
        expect(errorMessages).toContain(
          "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        );
        expect(errorMessages).toContain(
          "You must accept the terms and conditions"
        );
      }
    });
  });
});

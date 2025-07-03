import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });
process.env.NODE_ENV = "test";

// Mock Sequelize for tests
jest.mock("../config/database", () => ({
  sequelize: {
    sync: jest.fn(),
    authenticate: jest.fn(),
  },
}));

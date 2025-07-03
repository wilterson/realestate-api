module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/backend/src"],
  testMatch: ["**/__tests__/**/*.(spec|test).ts", "**/?(*.)+(spec|test).ts"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: {
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
        },
      },
    ],
  },
  collectCoverageFrom: [
    "backend/src/**/*.ts",
    "!backend/src/**/*.d.ts",
    "!backend/src/server.ts",
    "!backend/src/app.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  setupFilesAfterEnv: ["<rootDir>/backend/src/__tests__/setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/backend/src/$1",
  },
};

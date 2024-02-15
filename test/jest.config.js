module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.[jt]s", "**/?(*.)+(spec|test).[tj]s"],
  testPathIgnorePatterns: ["/node_modules/"],
  setupFilesAfterEnv: ["./jest.setup.js"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};

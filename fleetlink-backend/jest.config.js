module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/helpers/setup.js"],
  globalTeardown: "<rootDir>/tests/helpers/teardown.js",
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  collectCoverageFrom: [
    "routes/**/*.js",
    "middleware/**/*.js",
    "utils/**/*.js",
    "models/**/*.js",
    "!server.js",
    "!config/**/*.js",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  testTimeout: 30000,
  verbose: true,
};

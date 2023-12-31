export default {
  clearMocks: true,
  displayName: "AppServer",
  errorOnDeprecated: true,
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper: {
    "^@server$": "<rootDir>/src",
    "^@controllers$": "<rootDir>/src/controllers",
    "^@events/(.*)$": "<rootDir>/src/events/$1",
    "^@features/(.*)$": "<rootDir>/src/features/$1",
    "^@lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@middleware$": "<rootDir>/src/middleware",
    "^@schema$": "<rootDir>/src/schema",
    "^@types$": "<rootDir>/src/types",
    "^@resolverTypes$": "<rootDir>/src/types/resolverTypes",
    "^@utils$": "<rootDir>/src/utils",
    "^@tests$": "<rootDir>/src/utils/tests",
  },
  setupFiles: ["dotenv/config"],
  testEnvironment: "node",
  verbose: true,
};

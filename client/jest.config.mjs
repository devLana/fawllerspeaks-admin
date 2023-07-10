import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run

  clearMocks: true,
  displayName: "AppClient",
  errorOnDeprecated: true,
  moduleNameMapper: {
    "^@pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@context/(.*)$": "<rootDir>/src/context/$1",
    "^@features/(.*)$": "<rootDir>/src/features/$1",
    "^@layouts/(.*)$": "<rootDir>/src/layouts/$1",
    "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@types$": "<rootDir>/src/types",
    "^@apiTypes$": "<rootDir>/src/types/api/graphql",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@lib/(.*)$": "<rootDir>/src/lib/$1",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  testEnvironment: "jest-environment-jsdom",
  verbose: true,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);

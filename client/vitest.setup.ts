import { loadEnvConfig } from "@next/env";
import "@testing-library/jest-dom/vitest";

import { testServer } from "@utils/tests/server";

loadEnvConfig(process.cwd());

vi.mock("next/router");
vi.mock("next/font/google");
vi.mock("next/server");

globalThis.URL.createObjectURL = vi.fn(() => "data:blob-image-url");
globalThis.URL.revokeObjectURL = vi.fn(() => undefined);
globalThis.scrollTo = vi.fn(() => undefined);

beforeAll(() => {
  testServer.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  testServer.resetHandlers();
});

afterAll(() => {
  testServer.close();
});

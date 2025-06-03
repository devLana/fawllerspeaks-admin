import { loadEnvConfig } from "@next/env";
import "@testing-library/jest-dom/vitest";

loadEnvConfig(process.cwd());

vi.mock("next/router");
vi.mock("next/font/google");
vi.mock("next/server");

globalThis.URL.createObjectURL = vi.fn(() => "data:blob-image-url");
globalThis.URL.revokeObjectURL = vi.fn(() => undefined);
globalThis.scrollTo = vi.fn(() => undefined);

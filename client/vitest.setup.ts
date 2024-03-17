import { loadEnvConfig } from "@next/env";
import "@testing-library/jest-dom";

loadEnvConfig(process.cwd());

vi.mock("next/router");

globalThis.URL.createObjectURL = vi.fn(() => "data:blob-image-url");
globalThis.URL.revokeObjectURL = vi.fn(() => undefined);

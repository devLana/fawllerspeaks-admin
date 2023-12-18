import "@testing-library/jest-dom";

vi.mock("next/router");

globalThis.URL.createObjectURL = vi.fn(() => "data:blob-image-url");
globalThis.URL.revokeObjectURL = vi.fn(() => undefined);

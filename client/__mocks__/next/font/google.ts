import type { NextFont } from "next/dist/compiled/@next/font";

const lexend: NextFont = {
  className: "lexend-class-name",
  style: {
    fontFamily: "Lexend, sans-serif",
    fontStyle: "normal",
    fontWeight: 500,
  },
};

export const Lexend = vi.fn(() => lexend);

import { postStatusBgColors } from ".";
import type { ThemeMode } from "@types";

type ColorVariant = "light" | "main" | "dark";

const testName = (mode: ThemeMode, colorVariant: ColorVariant) => {
  return `When the theme mode is '${mode}', Expect the status background color to be the '${colorVariant}' color`;
};

const mocks: [string, ThemeMode, ColorVariant][] = [
  [testName("pitch black", "main"), "pitch black", "main"],
  [testName("sunny", "dark"), "sunny", "dark"],
  [testName("sunset", "main"), "sunset", "main"],
];

describe("Post Status Background Color Picker", () => {
  it.each(mocks)("%s", (_, mode, colorVariant) => {
    const result1 = postStatusBgColors("Draft", mode);
    expect(result1).toMatch(`warning.${colorVariant}`);

    const result2 = postStatusBgColors("Published", mode);
    expect(result2).toMatch(`success.${colorVariant}`);

    const result3 = postStatusBgColors("Unpublished", mode);
    expect(result3).toMatch(`info.${colorVariant}`);
  });
});

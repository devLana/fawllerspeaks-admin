import { postStatusColors } from ".";
import type { ThemeMode } from "types/appTheme";

type ColorVariant = "light" | "main" | "dark";

const testName = (mode: ThemeMode, colorVariant: ColorVariant) => {
  return `When the theme mode is '${mode}', Expect the status color to be the '${colorVariant}' color`;
};

const mocks: [string, ThemeMode, ColorVariant][] = [
  [testName("pitch black", "main"), "pitch black", "main"],
  [testName("sunny", "dark"), "sunny", "dark"],
  [testName("sunset", "main"), "sunset", "main"],
];

describe("Post Status Color Picker", () => {
  it.each(mocks)("%s", (_, mode, colorVariant) => {
    const result1 = postStatusColors("Draft", mode);
    expect(result1).toMatch(`warning.${colorVariant}`);

    const result2 = postStatusColors("Published", mode);
    expect(result2).toMatch(`success.${colorVariant}`);

    const result3 = postStatusColors("Unpublished", mode);
    expect(result3).toMatch(`info.${colorVariant}`);
  });
});

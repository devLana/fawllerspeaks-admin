import { screen } from "@testing-library/react";

import Personalize from "@pages/settings/personalization";
import { renderTestUI } from "@utils/renderTestUI";
import { DEFAULT_THEME } from "@utils/constants";
import type { AppTheme } from "@types";

describe("Personalization Settings", () => {
  beforeAll(() => {
    const theme: AppTheme = {
      color: "#6a6a6a",
      themeMode: "sunset",
      fontSize: 16,
    };

    localStorage.setItem(DEFAULT_THEME, JSON.stringify(theme));
  });

  afterAll(() => {
    localStorage.removeItem(DEFAULT_THEME);
  });

  describe("App theme", () => {
    it("Should read default theme mode from storage and save new theme mode to storage", async () => {
      const { user } = renderTestUI(<Personalize />);

      expect(screen.getByRole("radio", { name: /^sunset$/i })).toBeChecked();

      await user.click(screen.getByRole("radio", { name: /^sunny$/i }));
      expect(screen.getByRole("radio", { name: /^sunny$/i })).toBeChecked();
      expect(localStorage.getItem(DEFAULT_THEME)).toMatch(
        /"themeMode":"sunny"/
      );

      await user.click(screen.getByRole("radio", { name: /^sunset$/i }));
      expect(screen.getByRole("radio", { name: /^sunset$/i })).toBeChecked();
      expect(localStorage.getItem(DEFAULT_THEME)).toMatch(
        /"themeMode":"sunset"/
      );

      await user.click(screen.getByRole("radio", { name: /^pitch black$/i }));
      expect(
        screen.getByRole("radio", { name: /^pitch black$/i })
      ).toBeChecked();
      expect(localStorage.getItem(DEFAULT_THEME)).toMatch(
        /"themeMode":"pitch black"/
      );
    });
  });

  describe("Font size", () => {
    it("Should read default font size from localStorage", () => {
      renderTestUI(<Personalize />);

      expect(
        screen.getByRole("slider", { name: /^change font size$/i })
      ).toHaveValue("16");
    });
  });

  describe("Default color", () => {
    it("Should read default color from storage and save new color to localStorage", async () => {
      const { user } = renderTestUI(<Personalize />);

      expect(screen.getByRole("button", { name: /^gray$/i })).toContainElement(
        screen.getByTestId("CheckIcon")
      );

      await user.click(screen.getByRole("button", { name: /^blue$/i }));
      expect(localStorage.getItem(DEFAULT_THEME)).toMatch(/"color":"#7dd1f3"/);
      expect(screen.getByRole("button", { name: /^blue$/i })).toContainElement(
        screen.getByTestId("CheckIcon")
      );

      await user.click(screen.getByRole("button", { name: /^gray$/i }));
      expect(localStorage.getItem(DEFAULT_THEME)).toMatch(/"color":"#6a6a6a"/);
      expect(screen.getByRole("button", { name: /^gray$/i })).toContainElement(
        screen.getByTestId("CheckIcon")
      );
    });
  });
});

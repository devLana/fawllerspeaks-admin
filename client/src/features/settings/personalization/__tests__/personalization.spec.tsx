import { screen } from "@testing-library/react";

import Personalize from "@pages/settings/personalization";
import { renderUI } from "@testUtils/renderUI";
import { DEFAULT_THEME } from "@utils/constants";
import type { AppTheme } from "types/appTheme";

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
    it("Should read the default theme mode from localStorage and save the new theme mode to localStorage", async () => {
      const { user } = renderUI(<Personalize />);

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
    it("Should read the default font size from localStorage", () => {
      renderUI(<Personalize />);

      expect(
        screen.getByRole("slider", { name: /^change font size$/i })
      ).toHaveValue("16");
    });
  });

  describe("Default color", () => {
    it("Should read the default color from localStorage and save the new color to localStorage", async () => {
      const { user } = renderUI(<Personalize />);

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

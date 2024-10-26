import { screen } from "@testing-library/react";

import { appThemeProviderTestRenderer } from "./appThemeProviderTestRenderer";
import { DEFAULT_THEME } from "@utils/constants";
import type { AppTheme } from "types/appTheme";

describe("AppThemeProvider", () => {
  afterEach(() => {
    localStorage.removeItem(DEFAULT_THEME);
  });

  it("On initial render AppThemeProvider Should have default theme values", () => {
    appThemeProviderTestRenderer();

    expect(screen.getByText(/color: #[0-9a-f]{6}/i)).toBeInTheDocument();
    expect(screen.getByText(/font size: \d{2}/i)).toBeInTheDocument();

    expect(
      screen.getByText(/theme mode: (?:sunny|sunset|pitch black)/i)
    ).toBeInTheDocument();
  });

  it("AppThemeProvider Should read default theme values saved in localStorage", () => {
    const theme: AppTheme = {
      color: "#6a6a6a",
      themeMode: "sunset",
      fontSize: 16,
    };

    localStorage.setItem(DEFAULT_THEME, JSON.stringify(theme));
    appThemeProviderTestRenderer();

    expect(screen.getByText(/color: #6a6a6a/i)).toBeInTheDocument();
    expect(screen.getByText(/font size: 16/i)).toBeInTheDocument();
    expect(screen.getByText(/theme mode: sunset/i)).toBeInTheDocument();
  });

  it("A child component Should be able to update an app theme value", async () => {
    const { user } = appThemeProviderTestRenderer();

    expect(screen.getByText(/color: #[0-9a-f]{6}/i)).toBeInTheDocument();
    expect(screen.getByText(/font size: \d{2}/i)).toBeInTheDocument();

    expect(
      screen.getByText(/theme mode: (?:sunny|sunset|pitch black)/i)
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^change theme$/i }));

    expect(screen.getByText(/color: #[0-9a-f]{6}/i)).toBeInTheDocument();
    expect(screen.getByText(/font size: \d{2}/i)).toBeInTheDocument();
    expect(screen.getByText(/theme mode: pitch black/i)).toBeInTheDocument();

    expect(localStorage.getItem(DEFAULT_THEME)).toMatch(
      /"themeMode":"pitch black"/
    );
  });
});

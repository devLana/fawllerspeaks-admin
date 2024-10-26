import { screen } from "@testing-library/react";

import AuthLayoutThemeButton from "./AuthLayoutThemeButton";
import { renderUI } from "@utils/tests/renderUI";
import { DEFAULT_THEME } from "@utils/constants";

describe("Auth Root Layout Theme Button", () => {
  afterEach(() => {
    localStorage.removeItem(DEFAULT_THEME);
  });

  it("Should render with the default theme mode", () => {
    renderUI(<AuthLayoutThemeButton />);

    expect(
      screen.getByRole("button", { name: /^sunny$/i })
    ).toBeInTheDocument();
  });

  it("Should read the default theme mode from local storage", () => {
    localStorage.setItem(
      DEFAULT_THEME,
      JSON.stringify({ themeMode: "sunset", fontSize: 14, color: "#6a6a6a" })
    );

    renderUI(<AuthLayoutThemeButton />);

    expect(
      screen.getByRole("button", { name: /^sunset$/i })
    ).toBeInTheDocument();
  });

  it("Should be able to change the app theme mode", async () => {
    const { user } = renderUI(<AuthLayoutThemeButton />);

    expect(
      screen.getByRole("button", { name: /^sunny$/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^sunny$/i }));
    await user.click(screen.getByRole("menuitem", { name: /^pitch black$/i }));

    expect(
      screen.getByRole("button", { name: /^pitch black$/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^pitch black$/i }));
    await user.click(screen.getByRole("menuitem", { name: /^sunset$/i }));

    expect(
      screen.getByRole("button", { name: /^sunset$/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^sunset$/i }));
    await user.click(screen.getByRole("menuitem", { name: /^sunny$/i }));

    expect(
      screen.getByRole("button", { name: /^sunny$/i })
    ).toBeInTheDocument();
  });
});

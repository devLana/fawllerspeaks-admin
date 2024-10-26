import { screen } from "@testing-library/react";

import HeaderThemeButton from ".";
import { renderUI } from "@utils/tests/renderUI";
import { DEFAULT_THEME } from "@utils/constants";

describe("Root layout header theme button", () => {
  it("Should change the global app theme when the theme button is clicked", async () => {
    const { user } = renderUI(<HeaderThemeButton />);
    const name = { name: /^change app theme$/i };

    await user.click(screen.getByRole("button", name));

    expect(localStorage.getItem(DEFAULT_THEME)).toMatch(/"themeMode":"sunset"/);

    await user.click(screen.getByRole("button", name));

    expect(localStorage.getItem(DEFAULT_THEME)).toMatch(
      /"themeMode":"pitch black"/
    );

    await user.click(screen.getByRole("button", name));

    expect(localStorage.getItem(DEFAULT_THEME)).toMatch(/"themeMode":"sunny"/);

    localStorage.removeItem(DEFAULT_THEME);
  });
});

import { screen } from "@testing-library/react";

import AuthLayoutThemeButton from "../components/AuthLayoutThemeButton";
import { renderUI } from "@utils/tests/renderUI";
import { DEFAULT_THEME } from "@utils/constants";

const storageTheme = (theme: string) => {
  return JSON.stringify({
    themeMode: theme,
    fontSize: 14,
    color: "#7dd1f3",
  });
};

describe("Auth Root Layout Theme Button", () => {
  afterEach(() => {
    localStorage.removeItem(DEFAULT_THEME);
  });

  it("Should change app theme when theme menu item is clicked", async () => {
    const { user } = renderUI(<AuthLayoutThemeButton />);

    expect(
      screen.getByRole("button", { name: /^sunny$/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
    expect(screen.getAllByRole("menuitem")[0]).toHaveClass("Mui-selected");
    expect(screen.getAllByRole("menuitem")[1]).not.toHaveClass("Mui-selected");
    expect(screen.getAllByRole("menuitem")[2]).not.toHaveClass("Mui-selected");

    await user.click(screen.getAllByRole("menuitem")[2]);

    expect(
      screen.getByRole("button", { name: /^pitch black$/i })
    ).toBeInTheDocument();
    expect(localStorage.getItem(DEFAULT_THEME)).toBe(
      storageTheme("pitch black")
    );

    await user.click(screen.getByRole("button", { name: /^pitch black$/i }));

    expect(screen.getAllByRole("menuitem")[0]).not.toHaveClass("Mui-selected");
    expect(screen.getAllByRole("menuitem")[1]).not.toHaveClass("Mui-selected");
    expect(screen.getAllByRole("menuitem")[2]).toHaveClass("Mui-selected");
  });

  it("Should read default theme from localStorage on initial render", async () => {
    localStorage.setItem(DEFAULT_THEME, storageTheme("sunset"));
    const { user } = renderUI(<AuthLayoutThemeButton />);

    expect(
      screen.getByRole("button", { name: /^sunset$/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^sunset$/i }));

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
    expect(screen.getAllByRole("menuitem")[0]).not.toHaveClass("Mui-selected");
    expect(screen.getAllByRole("menuitem")[1]).toHaveClass("Mui-selected");
    expect(screen.getAllByRole("menuitem")[2]).not.toHaveClass("Mui-selected");
  });
});

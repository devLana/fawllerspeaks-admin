import { renderTestUI } from "@utils/renderTestUI";
import AuthLayoutThemeToggle from ".";
import { screen } from "@testing-library/react";
import { DEFAULT_THEME } from "@utils/constants";

describe("Auth Layout Theme Button", () => {
  afterEach(() => {
    localStorage.removeItem(DEFAULT_THEME);
  });

  it("Change app theme when theme menu item is clicked", async () => {
    const { user } = renderTestUI(<AuthLayoutThemeToggle />);

    expect(screen.getByRole("button")).toHaveTextContent("Sunny");

    await user.click(screen.getByRole("button"));

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
    expect(screen.getAllByRole("menuitem")[0]).toHaveClass("Mui-selected");
    expect(screen.getAllByRole("menuitem")[1]).not.toHaveClass("Mui-selected");
    expect(screen.getAllByRole("menuitem")[2]).not.toHaveClass("Mui-selected");

    await user.click(screen.getAllByRole("menuitem")[2]);

    expect(screen.getByRole("button")).toHaveTextContent("Pitch Black");
    expect(localStorage.getItem(DEFAULT_THEME)).toBe("pitch black");

    await user.click(screen.getByRole("button"));

    expect(screen.getAllByRole("menuitem")[0]).not.toHaveClass("Mui-selected");
    expect(screen.getAllByRole("menuitem")[1]).not.toHaveClass("Mui-selected");
    expect(screen.getAllByRole("menuitem")[2]).toHaveClass("Mui-selected");
  });

  it("On initial render read default theme from local storage", async () => {
    localStorage.setItem(DEFAULT_THEME, "sunset");
    const { user } = renderTestUI(<AuthLayoutThemeToggle />);

    expect(screen.getByRole("button")).toHaveTextContent("Sunset");

    await user.click(screen.getByRole("button"));

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
    expect(screen.getAllByRole("menuitem")[0]).not.toHaveClass("Mui-selected");
    expect(screen.getAllByRole("menuitem")[1]).toHaveClass("Mui-selected");
    expect(screen.getAllByRole("menuitem")[2]).not.toHaveClass("Mui-selected");
  });
});

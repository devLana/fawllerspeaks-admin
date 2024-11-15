import { screen } from "@testing-library/react";
import { useTheme } from "@mui/material/styles";

import DefaultColors from "..";
import { renderUI } from "@utils/tests/renderUI";
import { DEFAULT_THEME } from "@utils/constants";

describe("Default color personalization setting", () => {
  afterEach(() => {
    localStorage.removeItem(DEFAULT_THEME);
  });

  const UI = () => {
    const { appTheme } = useTheme();
    return <DefaultColors color={appTheme.color} />;
  };

  it("Should render with the default 'blue' theme color", () => {
    renderUI(<UI />);

    expect(screen.getByRole("button", { name: /^blue$/i })).toContainElement(
      screen.getByTestId("CheckIcon")
    );
  });

  it("Should read the default color from local storage", () => {
    localStorage.setItem(
      DEFAULT_THEME,
      JSON.stringify({ themeMode: "sunny", fontSize: 14, color: "#6a6a6a" })
    );

    renderUI(<UI />);

    expect(screen.getByRole("button", { name: /^gray$/i })).toContainElement(
      screen.getByTestId("CheckIcon")
    );
  });

  it("Should be able to change the default theme color", async () => {
    const { user } = renderUI(<UI />);

    expect(screen.getByRole("button", { name: /^blue$/i })).toContainElement(
      screen.getByTestId("CheckIcon")
    );

    await user.click(screen.getByRole("button", { name: /^gray$/i }));

    expect(screen.getByRole("button", { name: /^gray$/i })).toContainElement(
      screen.getByTestId("CheckIcon")
    );

    await user.click(screen.getByRole("button", { name: /^blue$/i }));

    expect(screen.getByRole("button", { name: /^blue$/i })).toContainElement(
      screen.getByTestId("CheckIcon")
    );
  });
});

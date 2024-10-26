import { screen } from "@testing-library/react";
import { useTheme } from "@mui/material/styles";

import FontSize from ".";
import { renderUI } from "@utils/tests/renderUI";
import { DEFAULT_THEME } from "@utils/constants";

describe("Font size personalization setting", () => {
  afterEach(() => {
    localStorage.removeItem(DEFAULT_THEME);
  });

  const UI = () => {
    const { appTheme } = useTheme();
    return <FontSize fontSize={appTheme.fontSize} />;
  };

  it("Should render with the default font size", () => {
    renderUI(<UI />);

    expect(
      screen.getByRole("slider", { name: /^change font size$/i })
    ).toHaveValue("14");
  });

  it("Should read the default font size from local storage", () => {
    localStorage.setItem(
      DEFAULT_THEME,
      JSON.stringify({ themeMode: "sunny", fontSize: 16, color: "#6a6a6a" })
    );

    renderUI(<UI />);

    expect(
      screen.getByRole("slider", { name: /^change font size$/i })
    ).toHaveValue("16");
  });

  it("Should be able to change the default font size", async () => {
    const { user } = renderUI(<UI />);

    const slider = screen.getByRole("slider", { name: /^change font size$/i });

    expect(slider).toHaveValue("14");

    await user.pointer({
      target: slider,
      keys: "[MouseLeft]",
      coords: { x: 2 },
    });

    expect(slider).toHaveValue("18");
  });
});

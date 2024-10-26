import { screen } from "@testing-library/react";
import { useTheme } from "@mui/material/styles";

import Theme from "..";
import { renderUI } from "@utils/tests/renderUI";
import { DEFAULT_THEME } from "@utils/constants";

describe("App theme mode personalization setting", () => {
  afterEach(() => {
    localStorage.removeItem(DEFAULT_THEME);
  });

  const UI = () => {
    const { appTheme } = useTheme();
    return <Theme themeMode={appTheme.themeMode} />;
  };

  it("Should render with the default theme mode", () => {
    renderUI(<UI />);

    expect(screen.getByRole("radio", { name: /^sunny$/i })).toBeChecked();
  });

  it("Should read the default theme mode from local storage", () => {
    const themeMode = "pitch black";

    localStorage.setItem(
      DEFAULT_THEME,
      JSON.stringify({ themeMode, fontSize: 14, color: "#6a6a6a" })
    );

    renderUI(<UI />);

    expect(screen.getByRole("radio", { name: /^pitch black$/i })).toBeChecked();
  });

  it("Should be able to change the default theme mode", async () => {
    const { user } = renderUI(<UI />);

    expect(screen.getByRole("radio", { name: /^sunny$/i })).toBeChecked();

    await user.click(screen.getByRole("radio", { name: /^sunset$/i }));

    expect(screen.getByRole("radio", { name: /^sunset$/i })).toBeChecked();

    await user.click(screen.getByRole("radio", { name: /^pitch black$/i }));

    expect(screen.getByRole("radio", { name: /^pitch black$/i })).toBeChecked();

    await user.click(screen.getByRole("radio", { name: /^sunny$/i }));

    expect(screen.getByRole("radio", { name: /^sunny$/i })).toBeChecked();
  });
});

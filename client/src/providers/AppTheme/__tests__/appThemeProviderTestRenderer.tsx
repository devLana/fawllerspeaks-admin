import { useTheme } from "@mui/material/styles";
import userEvent from "@testing-library/user-event";
import { type RenderOptions, render } from "@testing-library/react";

import { useAppTheme } from "@hooks/common/useAppTheme";
import AppThemeProvider from "..";

const TestComponent = () => {
  const { appTheme } = useTheme();
  const handleAppTheme = useAppTheme();

  return (
    <div>
      <p>Color: {appTheme.color}</p>
      <p>Font Size: {appTheme.fontSize}</p>
      <p>Theme Mode: {appTheme.themeMode}</p>
      <button onClick={() => handleAppTheme("themeMode", "pitch black")}>
        Change Theme
      </button>
    </div>
  );
};

const UI = () => (
  <AppThemeProvider>
    <TestComponent />
  </AppThemeProvider>
);

export const appThemeProviderTestRenderer = (options?: RenderOptions) => {
  const view = render(<UI />, options);
  return { user: userEvent.setup(), ...view };
};

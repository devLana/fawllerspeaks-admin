import { useTheme } from "@mui/material/styles";
import userEvent from "@testing-library/user-event";
import { type RenderOptions, render } from "@testing-library/react";

import { useAppTheme } from "..";
import AppThemeProvider from "../AppThemeProvider";

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

export const appThemeProviderTestRenderer = (options?: RenderOptions) => {
  const UI = ({ ui }: { ui: React.ReactElement }) => (
    <AppThemeProvider>{ui}</AppThemeProvider>
  );

  const { rerender: rerenderFn, ...rest } = render(
    <UI ui={<TestComponent />} />,
    options
  );

  const rerender = (ui: React.ReactElement) => rerenderFn(<UI ui={ui} />);

  return { user: userEvent.setup(), rerender, ...rest };
};

import { type RenderOptions, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AuthProvider from "@context/Auth/AuthProvider";
import AppThemeProvider from "@context/AppTheme/AppThemeProvider";
import SessionProvider from "@context/Session/SessionProvider";
import { TEXT_NODE } from "../mocks/verifySession.mocks";
import testLayout from "./testLayout";

const TestComponent = () => <span>{TEXT_NODE}</span>;

const UI = ({ ui }: { ui: React.ReactElement }) => (
  <AuthProvider>
    <AppThemeProvider>
      <SessionProvider layout={testLayout} page={ui} />
    </AppThemeProvider>
  </AuthProvider>
);

export const sessionTestRenderer = (options?: RenderOptions) => {
  const { rerender: rerenderFn, ...rest } = render(
    <UI ui={<TestComponent />} />,
    options
  );

  const rerender = (ui: React.ReactElement) => rerenderFn(<UI ui={ui} />);

  return { user: userEvent.setup(), rerender, ...rest };
};

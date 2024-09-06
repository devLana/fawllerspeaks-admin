import { type RenderOptions, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AuthHeaderProvider from "@context/AuthHeader/AuthHeaderProvider";
import AppThemeProvider from "@context/AppTheme/AppThemeProvider";
import SessionProvider from "@features/auth/components/SessionProvider";
import { TEXT_NODE } from "../mocks/verifySession.mocks";
import testLayout from "./testLayout";

const TestComponent = () => <span>{TEXT_NODE}</span>;

const SessionProviderTestUI = () => (
  <AuthHeaderProvider>
    <AppThemeProvider>
      <SessionProvider layout={testLayout} page={<TestComponent />} />
    </AppThemeProvider>
  </AuthHeaderProvider>
);

export const sessionTestRenderer = (options?: RenderOptions) => ({
  user: userEvent.setup(),
  ...render(<SessionProviderTestUI />, options),
});

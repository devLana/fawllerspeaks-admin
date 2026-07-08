import { type RenderOptions, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AuthProvider from "@providers/Auth";
import AppThemeProvider from "@providers/AppTheme";
import SessionProvider from "@providers/Session";
import ToastProvider from "@providers/Toast";
import { TEXT_NODE } from "../mocks/verifySession.mocks";
import testLayout from "./testLayout";

const UI = () => (
  <AuthProvider>
    <AppThemeProvider>
      <ToastProvider>
        <SessionProvider layout={testLayout} page={<span>{TEXT_NODE}</span>} />
      </ToastProvider>
    </AppThemeProvider>
  </AuthProvider>
);

export const sessionTestRenderer = (options?: RenderOptions) => {
  const view = render(<UI />, options);
  return { user: userEvent.setup(), ...view };
};

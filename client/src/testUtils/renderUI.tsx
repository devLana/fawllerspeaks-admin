import { render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SessionContext } from "@context/Session";
import AuthHeaderProvider from "@context/AuthHeader/AuthHeaderProvider";
import AppThemeProvider from "@context/AppTheme/AppThemeProvider";

export const userIdHandler = vi.fn().mockName("handleUserId");
export const refreshTokenHandler = vi.fn().mockName("handleRefreshToken");
export const stopRefreshTokenTimer = vi
  .fn()
  .mockName("handleClearRefreshTokenTimer");

const sessionValue = {
  userId: "User:Authenticated_User_Id",
  handleUserId: userIdHandler,
  handleRefreshToken: refreshTokenHandler,
  handleClearRefreshTokenTimer: stopRefreshTokenTimer,
};

const AppWrapper = ({ children }: { children: React.ReactElement }) => (
  <AuthHeaderProvider>
    <AppThemeProvider>
      <SessionContext.Provider value={sessionValue}>
        {children}
      </SessionContext.Provider>
    </AppThemeProvider>
  </AuthHeaderProvider>
);

export const renderUI = (ui: React.ReactElement, options?: RenderOptions) => ({
  user: userEvent.setup({ applyAccept: false }),
  ...render(<AppWrapper>{ui}</AppWrapper>, options),
});

import { render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SessionContext } from "@context/SessionContext";
import ApolloContextProvider from "@components/ApolloContextProvider";
import MUIThemeProvider from "@components/MUIThemeProvider";

export const userIdHandler = jest.fn().mockName("handleUserId");
export const refreshTokenHandler = jest.fn().mockName("handleRefreshToken");
export const stopRefreshTokenTimer = jest
  .fn()
  .mockName("handleClearRefreshTokenTimer");

const sessionValue = {
  userId: "User:Authenticated_User_Id",
  handleUserId: userIdHandler,
  handleRefreshToken: refreshTokenHandler,
  handleClearRefreshTokenTimer: stopRefreshTokenTimer,
};

const AppWrapper = ({ children }: { children: React.ReactElement }) => (
  <ApolloContextProvider>
    <MUIThemeProvider>
      <SessionContext.Provider value={sessionValue}>
        {children}
      </SessionContext.Provider>
    </MUIThemeProvider>
  </ApolloContextProvider>
);

export const renderUI = (ui: React.ReactElement, options?: RenderOptions) => ({
  user: userEvent.setup({ applyAccept: false }),
  ...render(<AppWrapper>{ui}</AppWrapper>, options),
});

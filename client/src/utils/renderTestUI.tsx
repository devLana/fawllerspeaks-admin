import { InMemoryCache } from "@apollo/client";
import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import { render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ApolloContext } from "@context/ApolloContext";
import { SessionContext } from "@context/SessionContext";
import MUIThemeProvider from "@components/MUIThemeProvider";
import { BaseResponse, UserData } from "./cachePossibleTypes";

interface AppWrapperProps {
  children: React.ReactElement;
  mocks: MockedResponse[];
}

export const testUserId = "Authenticated_User_Id";

export const authHeaderHandler = jest.fn().mockName("handleAuthHeader");
export const userIdHandler = jest.fn().mockName("handleUserId");
export const refreshTokenHandler = jest.fn().mockName("handleRefreshToken");
export const stopRefreshTokenTimer = jest
  .fn()
  .mockName("handleClearRefreshTokenTimer");

const sessionValue = {
  userId: `User:${testUserId}`,
  handleUserId: userIdHandler,
  handleRefreshToken: refreshTokenHandler,
  handleClearRefreshTokenTimer: stopRefreshTokenTimer,
};

export const testCache = new InMemoryCache({
  possibleTypes: { BaseResponse, UserData },
});

const AppWrapper = ({ children, mocks }: AppWrapperProps) => (
  <ApolloContext.Provider value={authHeaderHandler}>
    <MockedProvider mocks={mocks} cache={testCache}>
      <MUIThemeProvider>
        <SessionContext.Provider value={sessionValue}>
          {children}
        </SessionContext.Provider>
      </MUIThemeProvider>
    </MockedProvider>
  </ApolloContext.Provider>
);

export const renderTestUI = (
  ui: React.ReactElement,
  mocks: MockedResponse[] = [],
  options?: RenderOptions
) => {
  return {
    user: userEvent.setup({ applyAccept: false }),
    ...render(<AppWrapper mocks={mocks}>{ui}</AppWrapper>, options),
  };
};

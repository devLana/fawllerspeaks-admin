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
  cache: InMemoryCache;
}

export const testUserId = "Authenticated_User_Id";

export const handleAuthHeader = jest.fn().mockName("handleAuthHeader");
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

const AppWrapper = ({ children, mocks, cache }: AppWrapperProps) => (
  <ApolloContext.Provider value={{ handleAuthHeader, jwt: "auth-token" }}>
    <MockedProvider mocks={mocks} cache={cache}>
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
  const cache = new InMemoryCache({
    possibleTypes: { BaseResponse, UserData },
  });

  return {
    user: userEvent.setup({ applyAccept: false }),
    ...render(
      <AppWrapper cache={cache} mocks={mocks}>
        {ui}
      </AppWrapper>,
      options
    ),
  };
};

import { render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InMemoryCache } from "@apollo/client";
import type { Cache } from "@apollo/client/cache/core/types/Cache";

import { SessionContext } from "@context/Session";
import AppThemeProvider from "@context/AppTheme/AppThemeProvider";
import AuthProvider from "@context/Auth/AuthProvider";
import apolloClient from "@context/Auth/helpers/apolloClient";
import { BaseResponse, UserData } from "@cache/possibleTypes";
import * as typePolicies from "@cache/typePolicies";

interface Options<D extends object, V extends object> extends RenderOptions {
  writeFragment?: Cache.WriteFragmentOptions<D, V>;
  writeQuery?: Cache.WriteQueryOptions<D, V>;
}

export const testUserId = "Authenticated_User_Id";
export const userIdHandler = vi.fn().mockName("handleUserId");
export const refreshTokenHandler = vi.fn().mockName("handleRefreshToken");

export const stopRefreshTokenTimer = vi
  .fn()
  .mockName("handleClearRefreshTokenTimer");

export const renderUI = <D extends object, V extends object>(
  ui: React.ReactElement,
  options: Options<D, V> = {}
) => {
  const { writeFragment, writeQuery, ...renderOptions } = options;

  const cache = new InMemoryCache({
    possibleTypes: { BaseResponse, UserData },
    typePolicies,
  });

  const client = apolloClient(undefined, cache);

  const UI = ({ children }: { children: React.ReactElement }) => (
    <AuthProvider appClient={client}>
      <AppThemeProvider>
        <SessionContext.Provider
          value={{
            userId: `User:${testUserId}`,
            handleUserId: userIdHandler,
            handleRefreshToken: refreshTokenHandler,
            handleClearRefreshTokenTimer: stopRefreshTokenTimer,
          }}
        >
          {children}
        </SessionContext.Provider>
      </AppThemeProvider>
    </AuthProvider>
  );

  if (writeFragment) client.writeFragment(writeFragment);
  if (writeQuery) client.writeQuery(writeQuery);

  const { rerender: fn, ...rest } = render(<UI>{ui}</UI>, renderOptions);
  const rerender = (elem: React.ReactElement) => fn(<UI>{elem}</UI>);

  return {
    user: userEvent.setup({ applyAccept: false }),
    client,
    rerender,
    ...rest,
  };
};

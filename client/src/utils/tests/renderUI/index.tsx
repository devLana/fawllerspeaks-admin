import { InMemoryCache } from "@apollo/client";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AuthProvider from "@providers/Auth";
import AppThemeProvider from "@providers/AppTheme";
import ToastProvider from "@providers/Toast";
import apolloClient from "@providers/Auth/helpers/apolloClient";
import { BaseResponse } from "@cache/possibleTypes";
import * as typePolicies from "@cache/typePolicies";
import type { TestRenderOpts } from "../sessionMocks";

export const renderUI = <D extends object, V extends object>(
  ui: React.ReactElement,
  options: TestRenderOpts<D, V> = {},
) => {
  const { writeFragment, writeQuery, ...renderOptions } = options;

  const cache = new InMemoryCache({
    possibleTypes: { BaseResponse },
    typePolicies,
  });

  const client = apolloClient(undefined, cache);

  const UI = (
    <AuthProvider appClient={client}>
      <AppThemeProvider>
        <ToastProvider>{ui}</ToastProvider>
      </AppThemeProvider>
    </AuthProvider>
  );

  if (writeFragment) client.writeFragment(writeFragment);
  if (writeQuery) client.writeQuery(writeQuery);

  const renderResult = render(UI, renderOptions);
  const user = userEvent.setup({ applyAccept: false });

  return { user, client, ...renderResult };
};

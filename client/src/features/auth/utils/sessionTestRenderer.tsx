import { type RenderOptions, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ApolloContextProvider from "@components/ApolloContextProvider";
import MUIThemeProvider from "@components/MUIThemeProvider";
import SessionProvider from "../components/SessionProvider";
import { TEXT_NODE } from "./verifySession.mocks";
import testLayout from "./testLayout";

const TestComponent = () => <span>{TEXT_NODE}</span>;

const SessionProviderTestUI = () => (
  <ApolloContextProvider>
    <MUIThemeProvider>
      <SessionProvider layout={testLayout} page={<TestComponent />} />
    </MUIThemeProvider>
  </ApolloContextProvider>
);

export const sessionTestRenderer = (options?: RenderOptions) => ({
  user: userEvent.setup(),
  ...render(<SessionProviderTestUI />, options),
});

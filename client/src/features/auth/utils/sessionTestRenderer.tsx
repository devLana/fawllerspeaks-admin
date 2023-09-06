import { InMemoryCache } from "@apollo/client";
import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import { type RenderOptions, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ApolloContext } from "@context/ApolloContext";
import SessionProvider from "../components/SessionProvider";
import MUIThemeProvider from "@components/MUIThemeProvider";
import { TEXT_NODE } from "./verifySession.mocks";
import testLayout from "./testLayout";
import { BaseResponse, UserData } from "@utils/cachePossibleTypes";

export const mockFn = jest.fn().mockName("apolloAuthHeaderHandler");

const TestComponent = () => <span>{TEXT_NODE}</span>;

const testCache = new InMemoryCache({
  possibleTypes: { BaseResponse, UserData },
});

const SessionProviderTestUI = ({ mocks }: { mocks: MockedResponse[] }) => (
  <ApolloContext.Provider value={mockFn}>
    <MockedProvider mocks={mocks} cache={testCache}>
      <MUIThemeProvider>
        <SessionProvider layout={testLayout} page={<TestComponent />} />
      </MUIThemeProvider>
    </MockedProvider>
  </ApolloContext.Provider>
);

export const sessionTestRenderer = (
  mocks: MockedResponse[] = [],
  options?: RenderOptions
) => ({
  user: userEvent.setup(),
  ...render(<SessionProviderTestUI mocks={mocks} />, options),
});

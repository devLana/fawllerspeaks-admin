import { InMemoryCache } from "@apollo/client";
import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import { type RenderOptions, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ApolloContext } from "@context/ApolloContext";
import SessionProvider from "../components/SessionProvider";
import { TEXT_NODE } from "./verifySession.mocks";
import testLayout from "@utils/testLayout";

export const mockFn = jest.fn().mockName("apolloAuthHeaderHandler");
export const testCache = new InMemoryCache();

const TestComponent = () => <span>{TEXT_NODE}</span>;

const SessionProviderTestUI = ({ mocks }: { mocks: MockedResponse[] }) => (
  <ApolloContext.Provider value={mockFn}>
    <MockedProvider mocks={mocks} cache={testCache}>
      <SessionProvider layout={testLayout} page={<TestComponent />} />
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

import type { ApolloClient } from "@apollo/client";
import type { RenderOptions } from "@testing-library/react";
import type { MockFunc as Func } from "@appTypes";

export interface TestRenderOpts<
  D extends object,
  V extends object,
> extends RenderOptions {
  writeFragment?: ApolloClient.WriteFragmentOptions<D, V>;
  writeQuery?: ApolloClient.WriteQueryOptions<D, V>;
}

export const handleRefreshToken = vi.fn<Func>().mockName("handleRefreshToken");

export const handleClearRefreshTokenTimer = vi
  .fn<Func>()
  .mockName("handleClearRefreshTokenTimer");

import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import {
  newAccessToken,
  refresh,
  table1,
  table2,
} from "../utils/refreshToken.mocks";
import { mockFn, sessionTestRenderer } from "../utils/sessionTestRenderer";
import { SESSION_ID } from "@utils/constants";

jest.useFakeTimers();
jest.spyOn(window, "setTimeout").mockName("setTimeout");

describe("Refresh expired user access token", () => {
  afterAll(() => {
    localStorage.removeItem(SESSION_ID);
    jest.useRealTimers();
  });

  describe("Redirect to the login page", () => {
    it.each(table1)("%s", async (_, status, mock) => {
      const { replace } = useRouter();
      localStorage.setItem(SESSION_ID, mock.sessionId);

      sessionTestRenderer(mock.gql());

      await waitFor(() => expect(setTimeout).toHaveBeenCalled());
      await waitFor(() => expect(replace).toHaveBeenCalledTimes(2));
      expect(replace).toHaveBeenCalledWith(`/login?status=${status}`);
    });
  });

  describe("Render an error alert UI", () => {
    it.each(table2)("%s", async (_, expected) => {
      localStorage.setItem(SESSION_ID, expected.sessionId);

      sessionTestRenderer(expected.gql());

      await waitFor(() => expect(setTimeout).toHaveBeenCalled());
      await expect(screen.findByRole("alert")).resolves.toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveTextContent(expected.message);
    });
  });

  describe("Refresh token request is successful", () => {
    it("Update application with refreshed access token", async () => {
      localStorage.setItem(SESSION_ID, refresh.sessionId);

      sessionTestRenderer(refresh.gql());

      await waitFor(() => expect(setTimeout).toHaveBeenCalled());
      await waitFor(() => expect(mockFn).toHaveBeenCalledTimes(2));
      expect(mockFn).toHaveBeenCalledWith(newAccessToken);
    });
  });
});

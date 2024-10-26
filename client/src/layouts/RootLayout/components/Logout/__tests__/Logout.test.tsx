import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import Logout from "..";
import * as mocks from "./Logout.mocks";
import { SESSION_ID } from "@utils/constants";
import { renderUI, stopRefreshTokenTimer } from "@utils/tests/renderUI";

describe("Logout API request", () => {
  const mockFn = vi.fn().mockName("onClose");

  beforeAll(() => {
    mocks.server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    mocks.server.close();
    localStorage.removeItem(SESSION_ID);
  });

  describe("API response is an error or an unsupported object type", () => {
    it.each(mocks.errors)("%s", async (_, data) => {
      localStorage.setItem(SESSION_ID, data.sessionId);

      const { user } = renderUI(<Logout isOpen onClose={mockFn} />);

      await user.click(screen.getByRole("button", { name: /^logout$/i }));

      expect(screen.getByRole("button", { name: /^logout$/i })).toBeDisabled();
      expect(screen.getByRole("button", { name: /^cancel$/i })).toBeDisabled();

      await waitFor(() => expect(mockFn).toHaveBeenCalledOnce());

      expect(screen.getByRole("button", { name: /^logout$/i })).toBeEnabled();
      expect(screen.getByRole("button", { name: /^cancel$/i })).toBeEnabled();
    });
  });

  describe("The logout response redirects the user", () => {
    it.each(mocks.logout)("%s", async (_, data, url) => {
      localStorage.setItem(SESSION_ID, data.sessionId);

      const { replace } = useRouter();

      const { user } = renderUI(<Logout isOpen onClose={mockFn} />);

      await user.click(screen.getByRole("button", { name: /^logout$/i }));

      expect(screen.getByRole("button", { name: /^logout$/i })).toBeDisabled();
      expect(screen.getByRole("button", { name: /^cancel$/i })).toBeDisabled();

      await waitFor(() => expect(replace).toHaveBeenCalledOnce());

      expect(replace).toHaveBeenCalledWith(url);
      expect(stopRefreshTokenTimer).toHaveBeenCalledOnce();
    });
  });
});

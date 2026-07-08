import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import * as mocks from "./mocks/verifySession.mocks";
import { sessionTestRenderer } from "./utils/sessionTestRenderer";
import { testServer } from "@utils/tests/server";

describe("Verify user session", () => {
  afterEach(() => {
    const router = useRouter();
    router.pathname = "/";
  });

  describe("API response is either an apollo client error or an unsupported object type", () => {
    it.each(mocks.alerts)("%s", async (_, errorMsg, requestHandler) => {
      const { reload, replace } = useRouter();
      testServer.use(requestHandler);

      const { user } = sessionTestRenderer();

      expect(screen.getByLabelText(/^loading session$/i)).toBeInTheDocument();
      expect(screen.queryByText(mocks.TEXT_NODE)).not.toBeInTheDocument();
      expect(await screen.findByRole("alert")).toHaveTextContent(errorMsg);

      expect(
        screen.queryByLabelText(/^loading session$/i),
      ).not.toBeInTheDocument();

      expect(screen.queryByText(mocks.TEXT_NODE)).not.toBeInTheDocument();
      expect(replace).not.toHaveBeenCalled();

      await user.click(screen.getByRole("button", { name: /reload page/i }));

      expect(reload).toHaveBeenCalledOnce();
    });
  });

  describe("User session verification error", () => {
    it.each(mocks.redirects)("%s", async (_, requestHandler) => {
      const { replace } = useRouter();
      testServer.use(requestHandler);

      sessionTestRenderer();

      expect(screen.getByLabelText(/^loading session$/i)).toBeInTheDocument();
      expect(screen.queryByText(mocks.TEXT_NODE)).not.toBeInTheDocument();

      await waitFor(() => {
        expect(replace).toHaveBeenCalledExactlyOnceWith("/login");
      });

      expect(screen.queryByText(mocks.TEXT_NODE)).not.toBeInTheDocument();
      expect(screen.getByLabelText(/^loading session$/i)).toBeInTheDocument();
    });
  });

  describe("Session verified and user authenticated", () => {
    it("Expect an error alert message box to be rendered if there was an error decoding the response access token", async () => {
      const { reload, replace } = useRouter();
      testServer.use(mocks.decode, mocks.refresher);

      const { user } = sessionTestRenderer();

      expect(screen.getByLabelText(/^loading session$/i)).toBeInTheDocument();
      expect(screen.queryByText(mocks.TEXT_NODE)).not.toBeInTheDocument();
      expect(await screen.findByRole("alert")).toHaveTextContent(mocks.MSG);
      expect(screen.queryByText(mocks.TEXT_NODE)).not.toBeInTheDocument();

      expect(
        screen.queryByLabelText(/^loading session$/i),
      ).not.toBeInTheDocument();

      expect(screen.queryByText(mocks.TEXT_NODE)).not.toBeInTheDocument();
      expect(replace).not.toHaveBeenCalled();

      await user.click(screen.getByRole("button", { name: /reload page/i }));

      expect(reload).toHaveBeenCalledOnce();
    });

    it.each(mocks.authRedirects)("%s", async (_, requestHandler, mock) => {
      const router = useRouter();
      router.pathname = mock.from;
      testServer.use(requestHandler, mocks.refresher);

      sessionTestRenderer();

      expect(screen.queryByText(mocks.TEXT_NODE)).not.toBeInTheDocument();
      expect(screen.getByLabelText(/^loading session$/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledExactlyOnceWith(mock.to);
      });

      expect(screen.getByText(mocks.TEXT_NODE)).toBeInTheDocument();
      expect(
        screen.queryByLabelText(/^loading session$/i),
      ).not.toBeInTheDocument();
    });

    it.each(mocks.renders)("%s", async (_, requestHandler, path) => {
      const router = useRouter();
      router.pathname = path;
      testServer.use(requestHandler, mocks.refresher);

      sessionTestRenderer();

      expect(screen.getByLabelText(/^loading session$/i)).toBeInTheDocument();
      expect(screen.queryByText(mocks.TEXT_NODE)).not.toBeInTheDocument();
      expect(await screen.findByText(mocks.TEXT_NODE)).toBeInTheDocument();
      expect(router.replace).not.toHaveBeenCalled();
      expect(
        screen.queryByLabelText(/^loading session$/i),
      ).not.toBeInTheDocument();
    });
  });
});

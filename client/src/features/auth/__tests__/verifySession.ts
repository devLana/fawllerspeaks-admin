import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import * as mocks from "../utils/verifySession.mocks";
import { sessionTestRenderer } from "../utils/sessionTestRenderer";
import { SESSION_ID } from "@utils/constants";

describe("Verify user session", () => {
  describe("User is not logged in", () => {
    afterAll(() => {
      const router = useRouter();
      router.pathname = "/";
    });

    it("Redirect to the login page", () => {
      const router = useRouter();

      router.pathname = "/posts";
      sessionTestRenderer();

      expect(screen.getByText(mocks.TEXT_NODE)).toBeInTheDocument();
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(router.replace).toHaveBeenCalledTimes(1);
      expect(router.replace).toHaveBeenCalledWith("/login");
    });

    it("Render the authentication page for the current route", () => {
      const router = useRouter();

      router.pathname = "/reset-password";
      sessionTestRenderer();

      expect(screen.getByText(mocks.TEXT_NODE)).toBeInTheDocument();
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(router.replace).not.toHaveBeenCalled();
    });
  });

  describe("User is logged in, Send a session verification request to the api", () => {
    beforeAll(() => {
      mocks.server.listen({ onUnhandledRequest: "error" });
    });

    afterAll(() => {
      const router = useRouter();

      router.pathname = "/";
      localStorage.removeItem(SESSION_ID);
      mocks.server.close();
    });

    describe("Api response is either an error or an unsupported object type", () => {
      it.each(mocks.tableOne)("%s", async (_, expected) => {
        localStorage.setItem(SESSION_ID, expected.sessionId);

        const { reload, replace } = useRouter();
        const { user } = sessionTestRenderer();

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
        expect(screen.queryByText(mocks.TEXT_NODE)).not.toBeInTheDocument();

        const alert = await screen.findByRole("alert");

        expect(alert).toHaveTextContent(expected.message);
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        expect(screen.queryByText(mocks.TEXT_NODE)).not.toBeInTheDocument();
        expect(replace).not.toHaveBeenCalled();

        await user.click(screen.getByRole("button", { name: /reload page/i }));
        expect(reload).toHaveBeenCalledTimes(1);
      });

      it("Should render an error alert message box if there was an error decoding the access token response", async () => {
        localStorage.setItem(SESSION_ID, mocks.decode.sessionId);

        const { reload } = useRouter();
        const { user } = sessionTestRenderer();

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
        expect(screen.queryByText(mocks.TEXT_NODE)).not.toBeInTheDocument();

        const alert = await screen.findByRole("alert");

        expect(alert).toHaveTextContent(mocks.msg1);
        expect(screen.queryByText(mocks.TEXT_NODE)).not.toBeInTheDocument();
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /reload page/i }));
        expect(reload).toHaveBeenCalledTimes(1);
      });
    });

    describe("Redirect the user based on the current route and the user authentication status", () => {
      it.each(mocks.tableTwo)("%s", async (_, mock) => {
        const { replace } = useRouter();

        localStorage.setItem(SESSION_ID, mock.sessionId);
        sessionTestRenderer();

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
        expect(screen.queryByText(mocks.TEXT_NODE)).not.toBeInTheDocument();

        await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));

        expect(replace).toHaveBeenCalledWith("/login");
        expect(screen.getByText(mocks.TEXT_NODE)).toBeInTheDocument();
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      });

      it.each(mocks.tableThree)("%s", async (_, pathname, mock) => {
        const router = useRouter();

        router.pathname = pathname;
        localStorage.setItem(SESSION_ID, mock.sessionId);
        sessionTestRenderer();

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
        expect(screen.queryByText(mocks.TEXT_NODE)).not.toBeInTheDocument();

        expect(await screen.findByText(mocks.TEXT_NODE)).toBeInTheDocument();

        expect(router.replace).not.toHaveBeenCalled();
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      });
    });

    describe("User session successfully verified", () => {
      describe("User is redirected to one of the protected routes", () => {
        it.each(mocks.tableFour)("%s", async (_, expected) => {
          const router = useRouter();

          localStorage.setItem(SESSION_ID, expected.mock.sessionId);
          router.pathname = expected.from;
          sessionTestRenderer();

          expect(screen.getByRole("progressbar")).toBeInTheDocument();
          expect(screen.queryByText(mocks.TEXT_NODE)).not.toBeInTheDocument();

          await waitFor(() => {
            expect(router.replace).toHaveBeenCalledTimes(1);
          });
          expect(router.replace).toHaveBeenCalledWith(expected.to);

          expect(screen.getByText(mocks.TEXT_NODE)).toBeInTheDocument();
          expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        });
      });

      describe("The page at the current protected route is rendered", () => {
        it.each(mocks.tableFive)("%s", async (_, pathname, mock) => {
          const router = useRouter();

          localStorage.setItem(SESSION_ID, mock.sessionId);
          router.pathname = pathname;
          sessionTestRenderer();

          expect(screen.getByRole("progressbar")).toBeInTheDocument();
          expect(screen.queryByText(mocks.TEXT_NODE)).not.toBeInTheDocument();

          expect(await screen.findByText(mocks.TEXT_NODE)).toBeInTheDocument();

          expect(router.replace).not.toHaveBeenCalled();
          expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        });
      });
    });
  });
});

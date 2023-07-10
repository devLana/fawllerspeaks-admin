import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";
import jwtDecode, { InvalidTokenError } from "jwt-decode";

import {
  decode,
  LOGGED_IN_SESSION_ID,
  msg,
  notAllowed,
  tableOne,
  tableThree,
  tableTwo,
  TEXT_NODE,
} from "@features/auth/utils/VerifySessionMocks";
import {
  mockFn,
  sessionTestRenderer,
} from "@features/auth/utils/sessionTestRenderer";
import { SESSION_ID } from "@utils/constants";

const mock = jwtDecode as jest.MockedFunction<() => never>;

describe("Verify user session on initial app render", () => {
  describe("User is not logged in", () => {
    afterAll(() => {
      const router = useRouter();
      router.pathname = "/";
    });

    it("Redirect to the login page", () => {
      const router = useRouter();
      router.pathname = "/posts";

      sessionTestRenderer();

      expect(screen.getByText(TEXT_NODE)).toBeInTheDocument();
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(router.replace).toHaveBeenCalledTimes(1);
      expect(router.replace).toHaveBeenCalledWith("/login");
    });

    it("Render the page at the current route", () => {
      const router = useRouter();
      router.pathname = "/reset-password";

      sessionTestRenderer();

      expect(screen.getByText(TEXT_NODE)).toBeInTheDocument();
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(router.replace).not.toHaveBeenCalled();
    });
  });

  describe("User is logged in, Session verification request is sent to the server", () => {
    beforeEach(() => {
      localStorage.setItem(SESSION_ID, LOGGED_IN_SESSION_ID);
    });

    afterAll(() => {
      const router = useRouter();
      router.pathname = "/";

      localStorage.removeItem(SESSION_ID);
    });

    describe("Session verification responds with an error or an unsupported object type", () => {
      it("Redirect to the login page if the response is a NotAllowedError", async () => {
        const { replace } = useRouter();

        sessionTestRenderer(notAllowed.gql());

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
        expect(screen.queryByText(TEXT_NODE)).not.toBeInTheDocument();

        await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));

        expect(replace).toHaveBeenCalledWith("/login");
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        expect(screen.getByText(TEXT_NODE)).toBeInTheDocument();
      });

      it("Render the page at the current route if the response is a NotAllowedError", async () => {
        const router = useRouter();
        router.pathname = "/login";

        sessionTestRenderer(notAllowed.gql());

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
        expect(screen.queryByText(TEXT_NODE)).not.toBeInTheDocument();

        await expect(screen.findByText(TEXT_NODE)).resolves.toBeInTheDocument();

        expect(router.replace).not.toHaveBeenCalled();
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      });

      it.each(tableOne)("Render an error alert if %s", async (_, expected) => {
        const { user } = sessionTestRenderer(expected.gql);
        const { reload, replace } = useRouter();

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
        expect(screen.queryByText(TEXT_NODE)).not.toBeInTheDocument();

        const alert = await screen.findByRole("alert");

        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        expect(replace).not.toHaveBeenCalled();
        expect(alert).toHaveTextContent(expected.msg);
        expect(screen.queryByText(TEXT_NODE)).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /reload page/i }));
        expect(reload).toHaveBeenCalledTimes(1);
      });

      it("Render an error alert if jwt decoding throws an InvalidTokenError", async () => {
        mock.mockImplementationOnce(() => {
          throw new InvalidTokenError("Invalid access token provided");
        });

        const { user } = sessionTestRenderer(decode.gql());
        const { reload } = useRouter();

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
        expect(screen.queryByText(TEXT_NODE)).not.toBeInTheDocument();

        const alert = await screen.findByRole("alert");

        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        expect(alert).toHaveTextContent(msg);
        expect(screen.queryByText(TEXT_NODE)).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /reload page/i }));
        expect(reload).toHaveBeenCalledTimes(1);
      });
    });

    describe("Session verification is successful", () => {
      beforeAll(() => {
        jest.useFakeTimers();
        jest.spyOn(window, "setTimeout").mockName("setTimeout");
      });

      afterAll(() => {
        jest.useRealTimers();
      });

      describe("User is redirected to the appropriate page", () => {
        it.each(tableTwo)(
          "Redirect to the %s page if user is %s",
          async (_, __, expected) => {
            const router = useRouter();

            router.pathname = expected.from;
            sessionTestRenderer(expected.mock.gql());

            expect(screen.getByRole("progressbar")).toBeInTheDocument();
            expect(screen.queryByText(TEXT_NODE)).not.toBeInTheDocument();

            await waitFor(() => {
              expect(router.replace).toHaveBeenCalledTimes(1);
            });
            expect(router.replace).toHaveBeenCalledWith(expected.to);

            expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
            expect(screen.getByText(TEXT_NODE)).toBeInTheDocument();

            expect(mockFn).toHaveBeenCalled();
            expect(mockFn).toHaveBeenCalledWith("accessToken");
          }
        );
      });

      describe("The current page is rendered", () => {
        it.each(tableThree)(
          "Render the %s if user is %s",
          async (_, __, expected) => {
            const router = useRouter();

            router.pathname = expected.pathname;
            sessionTestRenderer(expected.mock.gql());

            expect(screen.getByRole("progressbar")).toBeInTheDocument();
            expect(screen.queryByText(TEXT_NODE)).not.toBeInTheDocument();

            expect(await screen.findByText(TEXT_NODE)).toBeInTheDocument();

            expect(router.replace).not.toHaveBeenCalled();
            expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

            expect(mockFn).toHaveBeenCalled();
            expect(mockFn).toHaveBeenCalledWith("accessToken");
          }
        );
      });
    });
  });
});

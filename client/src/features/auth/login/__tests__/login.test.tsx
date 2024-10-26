import { useRouter } from "next/router";

import { screen } from "@testing-library/react";

import LoginPage from "@pages/login";
import { renderUI } from "@utils/tests/renderUI";

vi.mock("../LoginForm");

describe("Forgot Password Page", () => {
  afterAll(() => {
    const router = useRouter();
    router.query = {};
  });

  it.each([
    [
      "Should display an alert toast if the user attempted an unauthorized action",
      "unauthorized",
      "You are unable to perform that action. Please log in",
    ],
    [
      "Should display an alert toast if the user is unauthenticated",
      "unauthenticated",
      "You are unable to perform that action. Please log in",
    ],
    [
      "Should display an alert toast if the current session has expired",
      "expired",
      "Current session has expired. Please log in",
    ],
  ])("%s", (_, status, message) => {
    const router = useRouter();
    router.query = { status };

    renderUI(<LoginPage />);

    expect(screen.getByRole("alert")).toHaveTextContent(message);
  });
});

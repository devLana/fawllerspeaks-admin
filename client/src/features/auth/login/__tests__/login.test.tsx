import { useRouter } from "next/router";

import { screen } from "@testing-library/react";

import { Login } from "@pages/login";
import { renderUI } from "@utils/tests/renderUI";

vi.mock("../LoginForm");

describe("Login Page", () => {
  afterAll(() => {
    const router = useRouter();
    router.query = {};
  });

  it.each([
    [
      "Should display an alert toast if the user's session could not be authorized",
      "unauthorized",
      "Something has gone wrong and you will have to log in again to continue using the dashboard",
    ],
    [
      "Should display an alert toast if the current session becomes invalid",
      "invalid",
      "Your session has ended. Please log in again to continue",
    ],
  ])("%s", (_, status, message) => {
    const router = useRouter();
    router.query = { status };

    renderUI(<Login />);

    expect(screen.getByRole("alert")).toHaveTextContent(message);
  });
});

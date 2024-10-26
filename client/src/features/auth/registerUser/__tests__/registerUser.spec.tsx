import { useRouter } from "next/router";

import { screen } from "@testing-library/react";

import RegisterUserPage from "@pages/register";
import { renderUI } from "@utils/tests/renderUI";

vi.mock("../RegisterUserForm");

describe("Forgot Password Page", () => {
  afterAll(() => {
    const router = useRouter();
    router.query = {};
  });

  it("Should display an alert message toast if the status token is 'unregistered'", () => {
    const router = useRouter();
    router.query = { status: "unregistered" };

    renderUI(<RegisterUserPage />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "You need to register your account before you can perform that action"
    );
  });
});

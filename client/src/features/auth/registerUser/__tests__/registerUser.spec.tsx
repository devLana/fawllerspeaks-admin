import { useRouter } from "next/router";

import { screen } from "@testing-library/react";

import { RegisterUser } from "@pages/register";
import { protectedTestUI } from "@utils/tests/renderUI/protected";

vi.mock("../RegisterUserForm");

describe("Register User Page", () => {
  afterAll(() => {
    const router = useRouter();
    router.query = {};
  });

  it("Should display an alert message toast if the status token is 'unregistered'", () => {
    const router = useRouter();
    router.query = { status: "unregistered" };

    protectedTestUI(<RegisterUser />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "You need to register your account before you can perform that action"
    );
  });
});

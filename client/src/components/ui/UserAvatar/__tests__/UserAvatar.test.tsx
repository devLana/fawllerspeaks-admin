import UserAvatar from "..";
import { renderUI } from "@utils/tests/renderUI";
import { screen } from "@testing-library/react";
import * as mocks from "./UserAvatar.mocks";

describe("UserAvatar", () => {
  it("If the user is unknown, Expect an avatar with a generic icon", () => {
    renderUI(<UserAvatar />);
    expect(screen.getByLabelText(/^user avatar$/i)).toBeInTheDocument();
  });

  it("User has uploaded a profile image, Expect an image avatar", () => {
    renderUI(<UserAvatar />, { writeFragment: mocks.userWithImage });

    expect(screen.queryByLabelText(/^user avatar$/i)).not.toBeInTheDocument();
    expect(screen.getByRole("img", mocks.name)).toBeInTheDocument();
  });

  it("User does not have a profile image, Expect an avatar with the user's initials", () => {
    renderUI(<UserAvatar />, { writeFragment: mocks.userWithoutImage });

    expect(screen.queryByLabelText(/^user avatar$/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText(mocks.initials)).toBeInTheDocument();
  });

  it("Should render an image avatar in a link that points to the profile page", () => {
    renderUI(<UserAvatar renderWithLink />, {
      writeFragment: mocks.userWithImage,
    });

    expect(screen.getByRole("link", mocks.name)).toBeInTheDocument();

    expect(screen.getByRole("link", mocks.name)).toContainElement(
      screen.getByRole("img", mocks.name)
    );

    expect(screen.getByRole("link", mocks.name)).toHaveAttribute(
      "href",
      "/settings/me"
    );
  });

  it("Should render a user initials avatar in a link that points to the profile page", () => {
    renderUI(<UserAvatar renderWithLink />, {
      writeFragment: mocks.userWithoutImage,
    });

    expect(screen.getByRole("link", mocks.initials_name)).toBeInTheDocument();

    expect(screen.getByRole("link", mocks.initials_name)).toContainElement(
      screen.getByText(mocks.initials)
    );

    expect(screen.getByRole("link", mocks.initials_name)).toHaveAttribute(
      "href",
      "/settings/me"
    );
  });
});

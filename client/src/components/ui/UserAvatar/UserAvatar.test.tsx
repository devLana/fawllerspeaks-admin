import { screen } from "@testing-library/react";

import UserAvatar from ".";
import { renderUI } from "@utils/tests/renderUI";
import { image, initials, first, last } from "@utils/tests/writeTestUser";

const name = { name: new RegExp(`${first} ${last} avatar`) };
const initials_name = { name: new RegExp(initials) };

describe("UserAvatar", () => {
  it("Expect an avatar with a generic icon if no user detail is available", () => {
    renderUI(<UserAvatar firstName={undefined} lastName="" image={null} />);
    expect(screen.getByLabelText(/^user avatar$/i)).toBeInTheDocument();
  });

  it("Expect an image avatar if the user has an uploaded profile image, ", () => {
    renderUI(<UserAvatar firstName={first} lastName={last} image={image} />);

    expect(screen.queryByLabelText(/^user avatar$/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", initials_name)).not.toBeInTheDocument();
    expect(screen.getByRole("img", name)).toBeInTheDocument();
  });

  it("Expect an avatar with the user's initials to be rendered in a link if the image link fails to load", () => {
    renderUI(
      <UserAvatar firstName={first} lastName={last} image={null} hasLink />,
    );

    expect(screen.queryByLabelText(/^user avatar$/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("img", name)).not.toBeInTheDocument();

    const link = screen.getByRole("link", initials_name);

    expect(screen.getByRole("link", initials_name)).toBeInTheDocument();
    expect(link).toContainElement(screen.getByText(initials));
    expect(link).toHaveAttribute("href", "/settings/me");
  });
});

import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";
import { http } from "msw";

import EditMe from "@pages/settings/me/edit";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "../utils/editProfile.mocks";

describe("Edit Profile", () => {
  const fName = { name: /^first name$/i };
  const lName = { name: /^last name$/i };

  global.URL.createObjectURL = jest.fn(() => "data:blob-image-url");
  global.URL.revokeObjectURL = jest.fn(() => undefined);

  // new describe block
  // ---- assert that form fields are loaded with user details

  describe("Client side form validation", () => {
    describe("Validate text input fields", () => {
      it("Input fields should have an error message if their value is an empty string", async () => {
        const { user } = renderUI(<EditMe />);
        const firstName = screen.getByRole("textbox", fName);
        const lastName = screen.getByRole("textbox", lName);

        await user.click(screen.getByRole("button", { name: /^edit$/i }));

        expect(firstName).toHaveAccessibleErrorMessage("Enter first name");
        expect(lastName).toHaveAccessibleErrorMessage("Enter last name");
      });

      it("Input fields should have an invalid error message if they have invalid values", async () => {
        const { user } = renderUI(<EditMe />);
        const firstName = screen.getByRole("textbox", fName);
        const lastName = screen.getByRole("textbox", lName);

        await user.type(firstName, "John1");
        await user.type(lastName, "Doe2");
        await user.click(screen.getByRole("button", { name: /^edit$/i }));

        expect(firstName).toHaveAccessibleErrorMessage(
          "First name cannot contain numbers"
        );

        expect(lastName).toHaveAccessibleErrorMessage(
          "Last name cannot contain numbers"
        );
      });
    });

    describe("Validate image file upload", () => {
      it("should not allow upload of non-image files", async () => {
        const { user } = renderUI(<EditMe />);
        const file = new File(["foo"], "foo.mp3", { type: "audio/mpeg" });
        const fileInput = screen.getByLabelText(/^Select Profile Image$/i);

        await user.upload(fileInput, file);

        expect(screen.getByRole("alert")).toHaveTextContent(
          "You can only upload an image file"
        );
      });

      it("Should allow upload of one image file at a time", async () => {
        const { user } = renderUI(<EditMe />);
        const file = new File(["bar"], "bar.jpg", { type: "image/jpeg" });
        const fileInput = screen.getByLabelText(/^Select Profile Image$/i);
        const avatarLabel = { name: /^Profile image upload preview$/i };

        await user.upload(fileInput, file);

        expect(screen.getByRole("img", avatarLabel)).toBeInTheDocument();
      });
    });
  });

  describe("Make edit profile api request", () => {
    beforeAll(() => {
      mocks.server.listen({ onUnhandledRequest: "error" });
    });

    afterAll(() => {
      mocks.server.close();
    });

    describe("Api responded with a validation error", () => {
      it("Input fields should have an error message", async () => {
        const { user } = renderUI(<EditMe />);
        const firstName = screen.getByRole("textbox", fName);
        const lastName = screen.getByRole("textbox", lName);

        await user.type(firstName, mocks.validate.firstName);
        await user.type(lastName, mocks.validate.lastName);
        await user.click(screen.getByRole("button", { name: /^edit$/i }));

        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();

        await expect(screen.findByRole("alert")).resolves.toHaveTextContent(
          mocks.imageError
        );

        expect(firstName).toHaveAccessibleErrorMessage(mocks.firstNameError);
        expect(lastName).toHaveAccessibleErrorMessage(mocks.lastNameError);
        expect(firstName).toHaveFocus();
        expect(screen.getByRole("button", { name: /^edit$/i })).toBeEnabled();
      });
    });

    describe("Api response is an error or an unsupported type", () => {
      it.each(mocks.errors)("%s", async (_, mock) => {
        const { user } = renderUI(<EditMe />);
        const firstName = screen.getByRole("textbox", fName);
        const lastName = screen.getByRole("textbox", lName);

        await user.type(firstName, mock.firstName);
        await user.type(lastName, mock.lastName);
        await user.click(screen.getByRole("button", { name: /^edit$/i }));

        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();

        await expect(screen.findByRole("alert")).resolves.toHaveTextContent(
          mock.message
        );

        expect(screen.getByRole("button", { name: /^edit$/i })).toBeEnabled();
      });
    });

    describe("Redirect the user to an authentication page", () => {
      it.each(mocks.redirects)("%s", async (_, mock, path) => {
        const { replace } = useRouter();
        const { user } = renderUI(<EditMe />);
        const firstName = screen.getByRole("textbox", fName);
        const lastName = screen.getByRole("textbox", lName);

        await user.type(firstName, mock.firstName);
        await user.type(lastName, mock.lastName);
        await user.click(screen.getByRole("button", { name: /^edit$/i }));

        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();
        await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
        expect(replace).toHaveBeenCalledWith(path);
        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();
      });
    });

    describe("User profile is edited", () => {
      afterEach(() => {
        mocks.server.resetHandlers();
      });

      it.each(mocks.upload)("%s", async (_, mock, [resolver, status]) => {
        mocks.server.use(http.post(/upload-image$/, resolver));

        const { user } = renderUI(<EditMe />);
        const { push } = useRouter();
        const file = new File(["bar"], "bar.png", { type: "image/png" });
        const firstName = screen.getByRole("textbox", fName);
        const lastName = screen.getByRole("textbox", lName);
        const fileInput = screen.getByLabelText(/^Select Profile Image$/i);

        await user.type(firstName, mock.firstName);
        await user.type(lastName, mock.lastName);
        await user.upload(fileInput, file);
        await user.click(screen.getByRole("button", { name: /^edit$/i }));

        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();
        await waitFor(() => expect(push).toHaveBeenCalledTimes(1));
        expect(push).toHaveBeenCalledWith(`/settings/me?status=${status}`);
        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();
      });
    });
  });
});

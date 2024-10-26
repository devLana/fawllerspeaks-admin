import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";
import { http } from "msw";

import EditProfileForm from "..";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "./EditProfileForm.mocks";

describe("Edit Profile", () => {
  describe("Edit profile form is rendered with user data read from the cache", () => {
    it("Form inputs should have the user's first & last name values with their profile image", () => {
      renderUI(<EditProfileForm />, { writeFragment: mocks.userWithImage });

      const firstName = screen.getByRole("textbox", mocks.fName);
      const lastName = screen.getByRole("textbox", mocks.lName);

      expect(firstName).toHaveDisplayValue(mocks.user.firstName);
      expect(lastName).toHaveDisplayValue(mocks.user.lastName);
      expect(screen.getByRole("img", mocks.userImg)).toBeInTheDocument();
    });

    it("No image avatar should be rendered if the user does not have a profile image", () => {
      renderUI(<EditProfileForm />, { writeFragment: mocks.userWithoutImage });

      const firstName = screen.getByRole("textbox", mocks.fName);
      const lastName = screen.getByRole("textbox", mocks.lName);

      expect(firstName).toHaveDisplayValue(mocks.user.firstName);
      expect(lastName).toHaveDisplayValue(mocks.user.lastName);
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });
  });

  describe("Client side form validation", () => {
    it("Text fields should have an error message if their value is an empty string", async () => {
      const { user } = renderUI(<EditProfileForm />);
      const firstName = screen.getByRole("textbox", mocks.fName);
      const lastName = screen.getByRole("textbox", mocks.lName);

      await user.click(screen.getByRole("button", { name: /^edit$/i }));

      expect(firstName).toHaveAccessibleErrorMessage("Enter first name");
      expect(lastName).toHaveAccessibleErrorMessage("Enter last name");
    });

    it("should not allow upload of non-image files", async () => {
      const { user } = renderUI(<EditProfileForm />);
      const file = new File(["foo"], "foo.mp3", { type: "audio/mpeg" });

      await user.upload(screen.getByLabelText(mocks.fileInput), file);

      expect(screen.getByRole("alert")).toHaveTextContent(
        "You can only upload an image file"
      );
    });
  });

  describe("Profile image", () => {
    it("Should allow the user to be able to select an image for upload", async () => {
      const { user } = renderUI(<EditProfileForm />);

      await user.upload(screen.getByLabelText(mocks.fileInput), mocks.file);

      expect(screen.getByRole("img", mocks.avatarLabel)).toBeInTheDocument();
    });

    it("The user should be able to remove their current profile image", async () => {
      const { user } = renderUI(<EditProfileForm />, {
        writeFragment: mocks.userWithImage,
      });

      expect(screen.getByRole("img", mocks.userImg)).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /^remove image$/i }));

      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("The user should be able to select a new image for upload to replace their current profile image", async () => {
      const { user } = renderUI(<EditProfileForm />, {
        writeFragment: mocks.userWithImage,
      });

      expect(screen.getByRole("img", mocks.userImg)).toBeInTheDocument();

      await user.upload(screen.getByLabelText(/^change image$/i), mocks.file);

      expect(screen.queryByRole("img", mocks.userImg)).not.toBeInTheDocument();
      expect(screen.getByRole("img", mocks.avatarLabel)).toBeInTheDocument();
    });
  });

  describe("Edit profile API request", () => {
    beforeAll(() => {
      mocks.server.listen({ onUnhandledRequest: "error" });
    });

    afterAll(() => {
      mocks.server.close();
    });

    describe("API responds with an input validation error", () => {
      it("Expect input fields to have an error message", async () => {
        const { user } = renderUI(<EditProfileForm />);
        const firstName = screen.getByRole("textbox", mocks.fName);
        const lastName = screen.getByRole("textbox", mocks.lName);

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

    describe("API response is an error or an unsupported type", () => {
      it.each(mocks.errors)("%s", async (_, mock) => {
        const { user } = renderUI(<EditProfileForm />);
        const firstName = screen.getByRole("textbox", mocks.fName);
        const lastName = screen.getByRole("textbox", mocks.lName);

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

    describe("The user is redirected to an authentication page", () => {
      it.each(mocks.redirects)("%s", async (_, mock, { params, pathname }) => {
        const router = useRouter();
        router.pathname = pathname;

        const { user } = renderUI(<EditProfileForm />);
        const firstName = screen.getByRole("textbox", mocks.fName);
        const lastName = screen.getByRole("textbox", mocks.lName);

        await user.type(firstName, mock.firstName);
        await user.type(lastName, mock.lastName);
        await user.click(screen.getByRole("button", { name: /^edit$/i }));

        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();

        await waitFor(() => expect(router.replace).toHaveBeenCalledOnce());

        expect(router.replace).toHaveBeenCalledWith(params);
        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();
      });
    });

    describe("User profile is edited", () => {
      it.each(mocks.upload)("%s", async (_, mock, [resolver, params]) => {
        mocks.server.use(http.post(/upload-image$/, resolver));

        const { user } = renderUI(<EditProfileForm />);
        const { push } = useRouter();
        const firstName = screen.getByRole("textbox", mocks.fName);
        const lastName = screen.getByRole("textbox", mocks.lName);

        await user.type(firstName, mock.firstName);
        await user.type(lastName, mock.lastName);
        await user.upload(screen.getByLabelText(mocks.fileInput), mocks.file);
        await user.click(screen.getByRole("button", { name: /^edit$/i }));

        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();

        await waitFor(() => expect(push).toHaveBeenCalledOnce());

        expect(push).toHaveBeenCalledWith(params);
        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();
      });
    });
  });
});

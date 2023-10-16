import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import "cross-fetch/polyfill";

import EditMe from "@pages/settings/me/edit";
import { renderTestUI } from "@utils/renderTestUI";
import {
  errors,
  imageFail,
  newImage,
  redirects,
  server,
  validation,
} from "../utils/editProfile.mocks";

describe("Edit Profile", () => {
  const fName = { name: /^first name$/i };
  const lName = { name: /^last name$/i };

  global.URL.createObjectURL = jest.fn(() => "data:blob-image-url");
  global.URL.revokeObjectURL = jest.fn(() => undefined);

  describe("Client side form validation", () => {
    describe("Validate input text boxes", () => {
      it("Display error messages for empty input fields", async () => {
        const { user } = renderTestUI(<EditMe />);
        const firstName = screen.getByRole("textbox", fName);
        const lastName = screen.getByRole("textbox", lName);

        await user.click(screen.getByRole("button", { name: /^edit$/i }));

        expect(firstName).toHaveErrorMessage("Enter first name");
        expect(lastName).toHaveErrorMessage("Enter last name");
      });

      it("Invalid input fields should have error messages", async () => {
        const { user } = renderTestUI(<EditMe />);
        const firstName = screen.getByRole("textbox", fName);
        const lastName = screen.getByRole("textbox", lName);

        await user.type(firstName, "John1");
        await user.type(lastName, "Doe2");
        await user.click(screen.getByRole("button", { name: /^edit$/i }));

        expect(firstName).toHaveErrorMessage(
          "First name cannot contain numbers"
        );
        expect(lastName).toHaveErrorMessage("Last name cannot contain numbers");
      });
    });

    describe("Validate image file upload", () => {
      it("User should not be able to upload a non-image file", async () => {
        const { user } = renderTestUI(<EditMe />);
        const file = new File(["foo"], "foo.mp3", { type: "audio/mpeg" });
        const fileInput = screen.getByLabelText(/^Select Profile Image$/i);

        await user.upload(fileInput, file);

        const alert = await screen.findByRole("alert");
        expect(alert).toHaveTextContent("You can only upload an image file");
      });

      it("Only one image file should be selected for upload", async () => {
        const { user } = renderTestUI(<EditMe />);
        const file = new File(["bar"], "bar.jpg", { type: "image/jpeg" });
        const fileInput = screen.getByLabelText(/^Select Profile Image$/i);
        const avatarLabel = { name: /^Profile image upload preview$/i };

        await user.upload(fileInput, file);

        expect(screen.getByRole("img", avatarLabel)).toBeInTheDocument();
      });
    });
  });

  describe("Make edit profile request", () => {
    beforeAll(() => {
      server.listen();
    });

    afterEach(() => {
      server.resetHandlers();
    });

    afterAll(() => {
      server.close();
    });

    describe("Request resolved with one or more input validation errors", () => {
      it("Show input field error messages", async () => {
        const { user } = renderTestUI(<EditMe />, validation.gql());
        const firstName = screen.getByRole("textbox", fName);
        const lastName = screen.getByRole("textbox", lName);

        await user.type(firstName, validation.input.firstName);
        await user.type(lastName, validation.input.lastName);
        await user.click(screen.getByRole("button", { name: /^edit$/i }));

        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();

        const alert = await screen.findByRole("alert");

        expect(alert).toHaveTextContent(validation.imageError);
        expect(firstName).toHaveErrorMessage(validation.firstNameError);
        expect(lastName).toHaveErrorMessage(validation.lastNameError);
        expect(firstName).toHaveFocus();
        expect(screen.getByRole("button", { name: /^edit$/i })).toBeEnabled();
      });
    });

    describe("Display an alert message if request resolved with an error or an unsupported object response", () => {
      it.each(errors)("%s", async (_, mock) => {
        const { user } = renderTestUI(<EditMe />, mock.gql());
        const firstName = screen.getByRole("textbox", fName);
        const lastName = screen.getByRole("textbox", lName);

        await user.type(firstName, mock.input.firstName);
        await user.type(lastName, mock.input.lastName);
        await user.click(screen.getByRole("button", { name: /^edit$/i }));

        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();

        const alert = await screen.findByRole("alert");

        expect(alert).toHaveTextContent(mock.message);
        expect(screen.getByRole("button", { name: /^edit$/i })).toBeEnabled();
      });
    });

    describe("Redirect to an auth page if the server responded with an error object", () => {
      it.each(redirects)("%s", async (_, mock, path) => {
        const { replace } = useRouter();
        const { user } = renderTestUI(<EditMe />, mock.gql());
        const firstName = screen.getByRole("textbox", fName);
        const lastName = screen.getByRole("textbox", lName);

        await user.type(firstName, mock.input.firstName);
        await user.type(lastName, mock.input.lastName);
        await user.click(screen.getByRole("button", { name: /^edit$/i }));

        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();
        await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
        expect(replace).toHaveBeenCalledWith(path);
        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();
      });
    });

    describe("Edit request is successful", () => {
      it("Image upload failed, User profile is partially updated without an image", async () => {
        server.use(
          rest.post("http://localhost:7692/upload-image", (_, res, ctx) => {
            return res(ctx.status(500), ctx.json({}));
          })
        );

        const { user } = renderTestUI(<EditMe />, imageFail.gql());
        const { push } = useRouter();
        const file = new File(["bar"], "bar.png", { type: "image/png" });
        const firstName = screen.getByRole("textbox", fName);
        const lastName = screen.getByRole("textbox", lName);
        const fileInput = screen.getByLabelText(/^Select Profile Image$/i);

        await user.type(firstName, imageFail.input.firstName);
        await user.type(lastName, imageFail.input.lastName);
        await user.upload(fileInput, file);
        await user.click(screen.getByRole("button", { name: /^edit$/i }));

        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();
        await waitFor(() => expect(push).toHaveBeenCalledTimes(1));
        expect(push).toHaveBeenCalledWith("/settings/me?status=upload-error");
        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();
      });

      it("User profile is updated with a new image", async () => {
        const { user } = renderTestUI(<EditMe />, newImage.gql());
        const { push } = useRouter();
        const file = new File(["bar"], "bar.jpg", { type: "image/jpeg" });
        const firstName = screen.getByRole("textbox", fName);
        const lastName = screen.getByRole("textbox", lName);
        const fileInput = screen.getByLabelText(/^Select Profile Image$/i);

        await user.type(firstName, newImage.input.firstName);
        await user.type(lastName, newImage.input.lastName);
        await user.upload(fileInput, file);
        await user.click(screen.getByRole("button", { name: /^edit$/i }));

        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();
        await waitFor(() => expect(push).toHaveBeenCalledTimes(1));
        expect(push).toHaveBeenCalledWith("/settings/me?status=upload");
        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();
      });
    });
  });
});

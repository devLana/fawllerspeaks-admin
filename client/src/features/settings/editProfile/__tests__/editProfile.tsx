import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import "cross-fetch/polyfill";

import EditMe from "@pages/settings/me/edit";
import { renderTestUI } from "@utils/renderTestUI";
import {
  FIRST_NAME,
  LAST_NAME,
  cacheSetup,
  clearTestCache,
  errors,
  imageFail,
  newImage,
  redirects,
  removeImage,
  server,
  validation,
} from "../utils/editProfile.mocks";

describe("Edit Profile", () => {
  const fName = { name: /^first name$/i };
  const lName = { name: /^last name$/i };

  global.URL.createObjectURL = jest.fn(() => "data:blob-image-url");
  global.URL.revokeObjectURL = jest.fn(() => undefined);

  describe("On initial page render", () => {
    const noImageFileLabel = { name: /^select profile image$/i };

    afterEach(() => {
      clearTestCache();
    });

    it("Form controls should have values equal to the user's cache data", () => {
      cacheSetup();
      renderTestUI(<EditMe />);

      expect(screen.getByRole("textbox", fName)).toHaveValue(FIRST_NAME);
      expect(screen.getByRole("textbox", lName)).toHaveValue(LAST_NAME);
      expect(screen.getByRole("button", noImageFileLabel)).toBeInTheDocument();
    });

    it("Display an image avatar if user has a profile image", async () => {
      const altText = `^${FIRST_NAME} ${LAST_NAME} Profile Image$`;
      const profileImg = { name: new RegExp(altText, "i") };

      cacheSetup(undefined, true);
      const { user } = renderTestUI(<EditMe />);

      expect(screen.getByRole("img", profileImg)).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /^remove image$/i }));

      expect(screen.queryByRole("img", profileImg)).not.toBeInTheDocument();
      expect(screen.getByRole("button", noImageFileLabel)).toBeInTheDocument();
    });
  });

  describe("Client side form validation", () => {
    describe("Validate input text boxes", () => {
      it("Display error messages for empty input fields", async () => {
        const { user } = renderTestUI(<EditMe />);
        const firstName = screen.getByRole("textbox", fName);
        const lastName = screen.getByRole("textbox", lName);

        await user.clear(firstName);
        await user.clear(lastName);
        await user.click(screen.getByRole("button", { name: /^edit$/i }));

        expect(firstName).toHaveErrorMessage("Enter first name");
        expect(lastName).toHaveErrorMessage("Enter last name");
      });

      it("Invalid input fields should have error messages", async () => {
        const { user } = renderTestUI(<EditMe />);
        const firstName = screen.getByRole("textbox", fName);
        const lastName = screen.getByRole("textbox", lName);

        await user.clear(firstName);
        await user.type(firstName, "John1");
        await user.clear(lastName);
        await user.type(lastName, "Doe2");
        await user.click(screen.getByRole("button", { name: /^edit$/i }));

        expect(firstName).toHaveErrorMessage(
          "First name cannot contain numbers"
        );
        expect(lastName).toHaveErrorMessage("Last name cannot contain numbers");
      });
    });

    describe("Validate image file upload", () => {
      afterEach(() => {
        clearTestCache();
      });

      it("User should not be able to upload a non-image file", async () => {
        cacheSetup(undefined, true);
        const { user } = renderTestUI(<EditMe />);
        const file = new File(["foo"], "foo.mp3", { type: "audio/mpeg" });
        const fileInput = screen.getByLabelText(/^change image$/i);

        await user.upload(fileInput, file);

        const alert = await screen.findByRole("alert");
        expect(alert).toHaveTextContent("You can only upload an image file");
      });

      it("Only an image file should be selected for upload", async () => {
        cacheSetup();
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
      clearTestCache();
    });

    afterAll(() => {
      server.close();
    });

    describe("Request resolved with one or more input validation errors", () => {
      it("Show input field error messages", async () => {
        cacheSetup(validation.input);
        const { user } = renderTestUI(<EditMe />, validation.gql());
        const firstName = screen.getByRole("textbox", fName);
        const lastName = screen.getByRole("textbox", lName);

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
        cacheSetup(mock.input);
        const { user } = renderTestUI(<EditMe />, mock.gql());

        await user.click(screen.getByRole("button", { name: /^edit$/i }));
        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();

        const alert = await screen.findByRole("alert");

        expect(alert).toHaveTextContent(mock.message);
        expect(screen.getByRole("button", { name: /^edit$/i })).toBeEnabled();
      });
    });

    describe("Redirect to an auth page if the server responded with an error object", () => {
      it.each(redirects)("%s", async (_, mock, path) => {
        cacheSetup(mock.input);
        const { replace } = useRouter();
        const { user } = renderTestUI(<EditMe />, mock.gql());

        await user.click(screen.getByRole("button", { name: /^edit$/i }));

        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();
        await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
        expect(replace).toHaveBeenCalledWith(path);
        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();
      });
    });

    describe("Edit request is successful", () => {
      it("Image upload failed, User profile is partially updated without an image", async () => {
        cacheSetup(imageFail.input);
        server.use(
          rest.post("/api/upload", (_, res, ctx) => {
            return res(ctx.status(500), ctx.text("Server Error"));
          })
        );

        const { user } = renderTestUI(<EditMe />, imageFail.gql());
        const { push } = useRouter();
        const file = new File(["bar"], "bar.png", { type: "image/png" });
        const fileInput = screen.getByLabelText(/^Select Profile Image$/i);

        await user.upload(fileInput, file);
        await user.click(screen.getByRole("button", { name: /^edit$/i }));

        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();
        await waitFor(() => expect(push).toHaveBeenCalledTimes(1));
        expect(push).toHaveBeenCalledWith("/settings/me?status=upload-error");
        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();
      });

      it("User profile is updated with a new image", async () => {
        cacheSetup(newImage.input);
        const { user } = renderTestUI(<EditMe />, newImage.gql());
        const { push } = useRouter();
        const file = new File(["bar"], "bar.jpg", { type: "image/jpeg" });
        const fileInput = screen.getByLabelText(/^change image$/i);

        await user.upload(fileInput, file);
        await user.click(screen.getByRole("button", { name: /^edit$/i }));

        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();
        await waitFor(() => expect(push).toHaveBeenCalledTimes(1));
        expect(push).toHaveBeenCalledWith("/settings/me?status=upload");
        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();
      });

      it("User profile is updated and profile image is removed", async () => {
        cacheSetup(removeImage.input, true);
        const { user } = renderTestUI(<EditMe />, removeImage.gql());
        const { push } = useRouter();

        await user.click(
          screen.getByRole("button", { name: /^remove image$/i })
        );
        await user.click(screen.getByRole("button", { name: /^edit$/i }));

        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();
        await waitFor(() => expect(push).toHaveBeenCalledTimes(1));
        expect(push).toHaveBeenCalledWith("/settings/me?status=upload");
        expect(screen.getByRole("button", { name: /^edit$/i })).toBeDisabled();
      });
    });
  });
});

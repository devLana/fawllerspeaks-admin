import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";
import { http } from "msw";

import CreatePostPage from "@pages/posts/new";
import * as mocks from "../utils/draftPost.mocks";
import { renderUI } from "@utils/tests/renderUI";

describe("Create blog post as draft", () => {
  beforeAll(() => {
    mocks.server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    mocks.server.close();
  });

  describe("Validate post title", () => {
    it("Should display an alert notification if the user tries to save a post without a title as draft", async () => {
      const { user } = renderUI(<CreatePostPage />);

      await user.click(screen.getByRole("button", mocks.draftBtn));

      expect(screen.getByRole("alert")).toHaveTextContent(
        "No post title provided"
      );
    });
  });

  describe("Validate image file upload", () => {
    it("Should not allow upload of non-image files", async () => {
      const { user } = renderUI(<CreatePostPage />);
      const file = new File(["foo"], "foo.mp3", { type: "audio/mpeg" });

      await user.upload(screen.getByLabelText(mocks.regex), file);

      expect(screen.getByLabelText(mocks.regex)).toHaveAccessibleErrorMessage(
        "You can only upload an image file"
      );
    });

    it("Should allow upload of one image file at a time", async () => {
      const { user } = renderUI(<CreatePostPage />);
      const file = new File(["bar"], "bar.jpg", { type: "image/jpeg" });
      const imgLabel = { name: /^Post image banner preview$/i };

      await user.upload(screen.getByLabelText(mocks.regex), file);

      expect(
        screen.getByLabelText(/^change image$/i)
      ).not.toHaveAccessibleErrorMessage();

      expect(screen.getByRole("img", imgLabel)).toBeInTheDocument();
    });
  });

  describe("Draft post api request", () => {
    describe("Display a notification message for an error/unsupported object type response", () => {
      it.each(mocks.alerts)("%s", async (_, { title: value, message }) => {
        const { user } = renderUI(<CreatePostPage />);

        await user.type(screen.getByRole("textbox", mocks.main), value);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.next)).toBeDisabled();
        expect(await screen.findByRole("alert")).toHaveTextContent(message);
        expect(screen.getByRole("button", mocks.draftBtn)).toBeEnabled();
        expect(screen.getByRole("button", mocks.next)).toBeEnabled();
      });
    });

    describe("Redirect the user to an authentication page", () => {
      it.each(mocks.redirects)("%s", async (_, mock, { pathname, url }) => {
        const router = useRouter();
        router.pathname = pathname;

        const { user } = renderUI(<CreatePostPage />);

        await user.type(screen.getByRole("textbox", mocks.main), mock.title);
        await user.type(screen.getByRole("textbox", mocks.description), "test");
        await user.click(screen.getByRole("button", mocks.next));

        expect(screen.queryByRole("form", mocks.form)).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        await waitFor(() => expect(router.replace).toHaveBeenCalledTimes(1));
        expect(router.replace).toHaveBeenCalledWith(url);
        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
      });
    });

    describe("Save post as draft", () => {
      afterEach(() => {
        mocks.server.resetHandlers();
      });

      it.each(mocks.drafts)("%s", async (_, { mock, path, resolver }) => {
        mocks.server.use(http.post(/upload-image$/, resolver));

        const { user } = renderUI(<CreatePostPage />);
        const { push } = useRouter();
        const file = new File(["bar"], "bar.png", { type: "image/png" });

        await user.type(screen.getByRole("textbox", mocks.main), mock.title);
        await user.upload(screen.getByLabelText(mocks.regex), file);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.next)).toBeDisabled();
        await waitFor(() => expect(push).toHaveBeenCalledTimes(1));
        expect(push).toHaveBeenCalledWith(path);
        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.next)).toBeDisabled();
      });
    });
  });
});

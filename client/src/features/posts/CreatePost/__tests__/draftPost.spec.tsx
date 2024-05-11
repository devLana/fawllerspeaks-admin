import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";
import { http } from "msw";

import CreatePostPage from "@pages/posts/new";
import * as mocks from "../utils/draftPost.mocks";
import { renderUI } from "@utils/tests/renderUI";

vi.mock("../components/PostContent/components/CKEditorComponent");

describe("Draft Post", () => {
  beforeAll(() => {
    mocks.server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    mocks.server.close();
  });

  describe("Post title validation", () => {
    it("Post title field should have an error message if no post title is provided", async () => {
      const { user } = renderUI(<CreatePostPage />);

      await user.click(screen.getByRole("button", mocks.draftBtn));

      expect(
        screen.getByRole("textbox", mocks.titleLabel)
      ).toHaveAccessibleErrorMessage("Provide post title");
    });
  });

  describe("Image file upload validation", () => {
    it("A non-image file is selected, Image input should have an error message", async () => {
      const { user } = renderUI(<CreatePostPage />);
      const file = new File(["foo"], "foo.mp3", { type: "audio/mpeg" });

      await user.upload(screen.getByLabelText(mocks.imageLabel), file);

      expect(
        screen.getByLabelText(mocks.imageLabel)
      ).toHaveAccessibleErrorMessage("You can only upload an image file");
    });

    it("Should allow upload of only one image file at a time", async () => {
      const { user } = renderUI(<CreatePostPage />);
      const file = new File(["bar"], "bar.jpg", { type: "image/jpeg" });
      const imgLabel = { name: /^Post image banner preview$/i };

      await user.upload(screen.getByLabelText(mocks.imageLabel), file);

      expect(
        screen.getByLabelText(/^change image$/i)
      ).not.toHaveAccessibleErrorMessage();

      expect(screen.getByRole("img", imgLabel)).toBeInTheDocument();
    });
  });

  describe("Draft post api request", () => {
    describe("Api response is an error/unsupported object type response", () => {
      it.each(mocks.alerts)("%s", async (_, { title: value, message }) => {
        const { user } = renderUI(<CreatePostPage />);

        await user.type(screen.getByRole("textbox", mocks.titleLabel), value);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeDisabled();
        expect(await screen.findByRole("alert")).toHaveTextContent(message);
        expect(screen.getByRole("button", mocks.draftBtn)).toBeEnabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeEnabled();
      });
    });

    describe("Api response is a user authentication error object type", () => {
      it.each(mocks.redirects)("%s", async (_, mock, { pathname, url }) => {
        const router = useRouter();
        router.pathname = pathname;

        const { user } = renderUI(<CreatePostPage />);

        await user.type(
          screen.getByRole("textbox", mocks.titleLabel),
          mock.title
        );

        await user.type(screen.getByRole("textbox", mocks.description), "test");
        await user.type(screen.getByRole("textbox", mocks.excerpt), "excerpt");
        await user.click(screen.getByRole("button", mocks.metadataNext));

        expect(
          screen.queryByRole("region", mocks.metadataRegion)
        ).not.toBeInTheDocument();

        expect(
          screen.getByRole("region", mocks.contentRegion)
        ).toBeInTheDocument();

        await waitFor(() => {
          expect(
            screen.getByRole("button", mocks.contentNext)
          ).toBeInTheDocument();
        });

        expect(screen.getByRole("textbox", mocks.content)).toBeInTheDocument();

        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.contentNext)).toBeDisabled();
        await waitFor(() => expect(router.replace).toHaveBeenCalledTimes(1));
        expect(router.replace).toHaveBeenCalledWith(url);
        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.contentNext)).toBeDisabled();
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

        await user.type(
          screen.getByRole("textbox", mocks.titleLabel),
          mock.title
        );

        await user.upload(screen.getByLabelText(mocks.imageLabel), file);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeDisabled();
        await waitFor(() => expect(push).toHaveBeenCalledTimes(1));
        expect(push).toHaveBeenCalledWith(path);
        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeDisabled();
      });
    });
  });
});

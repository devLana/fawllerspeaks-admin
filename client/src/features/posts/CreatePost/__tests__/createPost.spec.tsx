import { useRouter } from "next/router";

import { screen, waitFor, within } from "@testing-library/react";
import { http } from "msw";

import CreatePostPage from "@pages/posts/new";
import * as mocks from "../utils/createPost.mocks";
import { renderUI } from "@utils/tests/renderUI";
import type { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";

vi.mock("../components/CreatePostContent/components/CKEditorComponent");

describe("Create Post", () => {
  beforeAll(() => {
    mocks.server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    mocks.server.close();
  });

  const utils = async (user: UserEvent, title = "title") => {
    await user.type(screen.getByRole("textbox", mocks.titleLabel), title);
    await user.type(screen.getByRole("textbox", mocks.description), "abcd");
    await user.type(screen.getByRole("textbox", mocks.excerpt), "excerpt");
    await user.click(screen.getByRole("button", mocks.metadataNext));

    expect(
      screen.queryByRole("region", mocks.metadataRegion)
    ).not.toBeInTheDocument();

    expect(screen.getByRole("region", mocks.contentRegion)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("button", mocks.contentNext)).toBeInTheDocument();
    });
  };

  describe("Post metadata section", () => {
    describe("Title, description & excerpt form input field validations", () => {
      it("When no values are provided for the title, description and excerpt fields and the user tries to proceed to the post content section, Expect the input fields to have an error message", async () => {
        const { user } = renderUI(<CreatePostPage />);

        await user.click(screen.getByRole("button", mocks.metadataNext));

        expect(
          screen.getByRole("textbox", mocks.titleLabel)
        ).toHaveAccessibleErrorMessage("Enter post title");

        expect(
          screen.getByRole("textbox", mocks.description)
        ).toHaveAccessibleErrorMessage("Enter post description");

        expect(
          screen.getByRole("textbox", mocks.excerpt)
        ).toHaveAccessibleErrorMessage("Enter post excerpt");
      });

      it("When no value is provided for the title input field and the user tries to save the post as draft, Expect the title input field to have an error message", async () => {
        const { user } = renderUI(<CreatePostPage />);

        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(
          screen.getByRole("textbox", mocks.titleLabel)
        ).toHaveAccessibleErrorMessage("Enter post title");

        expect(
          screen.getByRole("textbox", mocks.description)
        ).not.toHaveAccessibleErrorMessage();

        expect(
          screen.getByRole("textbox", mocks.excerpt)
        ).not.toHaveAccessibleErrorMessage();
      });

      it.each(mocks.longTitleValue)("%s", async (_, buttonName) => {
        const { user } = renderUI(<CreatePostPage />);
        const titleBox = screen.getByRole("textbox", mocks.titleLabel);

        await user.type(titleBox, mocks.longText);
        await user.click(screen.getByRole("button", buttonName));

        expect(titleBox).toHaveAccessibleErrorMessage(mocks.titleMsg);
      });

      it.each(mocks.longDescriptionValue)("%s", async (_, buttonName) => {
        const { user } = renderUI(<CreatePostPage />);
        const textbox = screen.getByRole("textbox", mocks.description);

        await user.type(textbox, mocks.longText);
        await user.click(screen.getByRole("button", buttonName));

        expect(textbox).toHaveAccessibleErrorMessage(mocks.descriptionMsg);
      });

      it.each(mocks.longExcerptValue)("%s", async (_, buttonName) => {
        const { user } = renderUI(<CreatePostPage />);
        const excerptBox = screen.getByRole("textbox", mocks.excerpt);

        await user.type(excerptBox, mocks.longerText);
        await user.click(screen.getByRole("button", buttonName));

        expect(excerptBox).toHaveAccessibleErrorMessage(mocks.excerptMsg);
      });
    });

    describe("Image file form input validation", () => {
      it("A non-image file is selected, The image input field should have an error message", async () => {
        const { user } = renderUI(<CreatePostPage />);
        const file = new File(["foo"], "foo.mp3", { type: "audio/mpeg" });

        await user.upload(screen.getByLabelText(mocks.imageLabel), file);

        expect(
          screen.getByLabelText(mocks.imageLabel)
        ).toHaveAccessibleErrorMessage("You can only upload an image file");
      });

      it("An image file is selected, Should allow upload of only one image file at a time", async () => {
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

    describe("Create post section change", () => {
      it("When the user fills in the form input fields, Expect the page to change from the metadata section to the content section", async () => {
        const { user } = renderUI(<CreatePostPage />);

        await user.type(screen.getByRole("textbox", mocks.titleLabel), "title");
        await user.type(screen.getByRole("textbox", mocks.description), "abcd");
        await user.type(screen.getByRole("textbox", mocks.excerpt), "excerpt");
        await user.click(screen.getByRole("button", mocks.metadataNext));

        expect(
          screen.queryByRole("region", mocks.metadataRegion)
        ).not.toBeInTheDocument();

        expect(
          screen.getByRole("region", mocks.contentRegion)
        ).toBeInTheDocument();
      });
    });

    describe("Draft post API input validation errors", () => {
      it.each(mocks.titleSlug(true))("%s", async (_, { title, message }) => {
        const { user } = renderUI(<CreatePostPage />);
        const textbox = screen.getByRole("textbox", mocks.titleLabel);

        await user.type(textbox, title);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeDisabled();

        await waitFor(() => {
          expect(textbox).toHaveAccessibleErrorMessage(message);
        });

        expect(screen.getByRole("button", mocks.draftBtn)).toBeEnabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeEnabled();
      });

      it("When an unknown post tag is added to the post, Expect the post tag field to have an error message", async () => {
        const { user } = renderUI(<CreatePostPage />);
        const { title, message } = mocks.unknown;

        await user.type(screen.getByRole("textbox", mocks.titleLabel), title);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeDisabled();

        await waitFor(() => {
          expect(
            screen.getByRole("combobox", mocks.postTag)
          ).toHaveAccessibleErrorMessage(message);
        });

        expect(screen.getByRole("button", mocks.draftBtn)).toBeEnabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeEnabled();
      });

      it("When the API response is a PostValidationError object, Expect the respective input fields to have an error message", async () => {
        const { user } = renderUI(<CreatePostPage />);
        const { contentMsg, validate } = mocks;
        const titleBox = screen.getByRole("textbox", mocks.titleLabel);
        const description = screen.getByRole("textbox", mocks.description);
        const excerpt = screen.getByRole("textbox", mocks.excerpt);

        await user.type(titleBox, validate.title);
        await user.type(description, "description");
        await user.type(excerpt, "excerpt");
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeDisabled();
        expect(await screen.findByRole("alert")).toHaveTextContent(contentMsg);
        expect(titleBox).not.toHaveAccessibleErrorMessage();
        expect(description).toHaveAccessibleErrorMessage(mocks.descriptionMsg);
        expect(excerpt).toHaveAccessibleErrorMessage(mocks.excerptMsg);

        expect(
          screen.getByRole("combobox", mocks.postTag)
        ).toHaveAccessibleErrorMessage(mocks.tagsMsg);

        expect(
          screen.getByLabelText(mocks.imageLabel)
        ).toHaveAccessibleErrorMessage(mocks.imageBannerMsg);

        expect(description).toHaveFocus();
        expect(screen.getByRole("button", mocks.draftBtn)).toBeEnabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeEnabled();
      });
    });
  });

  describe("Post content section", () => {
    describe("Post content editor validation", () => {
      it("When no post content is provided and the user tries to proceed to the post preview section, Expect a post content error message to be present", async () => {
        const { user } = renderUI(<CreatePostPage />);

        await utils(user);
        await user.click(screen.getByRole("button", mocks.contentNext));

        expect(
          screen.getByRole("textbox", mocks.content)
        ).toHaveAccessibleErrorMessage("Enter post content");
      });
    });

    describe("Create post section change", () => {
      it("When the user fills in the post content, Expect the page to change from the content section to the preview section", async () => {
        const { content, contentHtml } = mocks;
        const { user } = renderUI(<CreatePostPage />);

        await utils(user);
        await user.type(screen.getByRole("textbox", content), contentHtml);
        await user.click(screen.getByRole("button", mocks.contentNext));

        expect(
          screen.queryByRole("region", mocks.contentRegion)
        ).not.toBeInTheDocument();

        expect(
          screen.getByRole("region", mocks.previewRegion)
        ).toBeInTheDocument();
      });
    });

    describe("Draft post API input validation errors", () => {
      it.each(mocks.titleSlug())("%s", async (_, { title, message }) => {
        const { user } = renderUI(<CreatePostPage />);

        await utils(user, title);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.contentNext)).toBeDisabled();
        await expect(screen.findByRole("alert")).resolves.toBeInTheDocument();

        const list = screen.getByRole("list", mocks.contentDraftErrors);

        expect(within(list).getByText(message)).toBeInTheDocument();
        expect(screen.getByRole("button", mocks.draftBtn)).not.toBeDisabled();

        expect(
          screen.getByRole("button", mocks.contentNext)
        ).not.toBeDisabled();
      });

      it("When an unknown post tag is added to the post, Expect an error alert list with a post tags error message", async () => {
        const { title, message } = mocks.unknown;
        const { user } = renderUI(<CreatePostPage />);

        await utils(user, title);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.contentNext)).toBeDisabled();
        await expect(screen.findByRole("alert")).resolves.toBeInTheDocument();

        const list = screen.getByRole("list", mocks.contentDraftErrors);

        expect(within(list).getByText(message)).toBeInTheDocument();
        expect(screen.getByRole("button", mocks.draftBtn)).not.toBeDisabled();

        expect(
          screen.getByRole("button", mocks.contentNext)
        ).not.toBeDisabled();
      });

      it("When the API response is a PostValidationError object, Expect an error alert list with validation error messages", async () => {
        const { validate, descriptionMsg, imageBannerMsg } = mocks;
        const { user } = renderUI(<CreatePostPage />);

        await utils(user, validate.title);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.contentNext)).toBeDisabled();
        await expect(screen.findByRole("alert")).resolves.toBeInTheDocument();

        const list = screen.getByRole("list", mocks.contentDraftErrors);

        expect(within(list).getAllByRole("listitem")).toHaveLength(4);
        expect(within(list).getByText(descriptionMsg)).toBeInTheDocument();
        expect(within(list).getByText(mocks.excerptMsg)).toBeInTheDocument();
        expect(within(list).getByText(mocks.tagsMsg)).toBeInTheDocument();
        expect(within(list).getByText(imageBannerMsg)).toBeInTheDocument();

        expect(
          screen.getByRole("textbox", mocks.content)
        ).toHaveAccessibleErrorMessage(mocks.contentMsg);

        expect(screen.getByRole("button", mocks.draftBtn)).not.toBeDisabled();

        expect(
          screen.getByRole("button", mocks.contentNext)
        ).not.toBeDisabled();
      });
    });
  });

  // TODO: describe("Post preview section", () => {});

  describe("Draft post API request responded with an error/unsupported object types", () => {
    it.each(mocks.alerts)("%s", async (_, { title, message }) => {
      const { user } = renderUI(<CreatePostPage />);

      await user.type(screen.getByRole("textbox", mocks.titleLabel), title);
      await user.click(screen.getByRole("button", mocks.draftBtn));

      expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
      expect(screen.getByRole("button", mocks.metadataNext)).toBeDisabled();
      expect(await screen.findByRole("alert")).toHaveTextContent(message);
      expect(screen.getByRole("button", mocks.draftBtn)).toBeEnabled();
      expect(screen.getByRole("button", mocks.metadataNext)).toBeEnabled();
    });
  });

  describe("Draft post API response is a user authentication error object type", () => {
    it.each(mocks.redirects)("%s", async (_, title, { pathname, url }) => {
      const router = useRouter();
      router.pathname = pathname;

      const { user } = renderUI(<CreatePostPage />);

      await utils(user, title);
      await user.click(screen.getByRole("button", mocks.draftBtn));

      expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
      expect(screen.getByRole("button", mocks.contentNext)).toBeDisabled();
      await waitFor(() => expect(router.replace).toHaveBeenCalledTimes(1));
      expect(router.replace).toHaveBeenCalledWith(url);
      expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
      expect(screen.getByRole("button", mocks.contentNext)).toBeDisabled();
    });
  });

  describe("Draft post API request successfully saves post as draft", () => {
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

  // TODO: describe("Create post api responses", () => {});
});

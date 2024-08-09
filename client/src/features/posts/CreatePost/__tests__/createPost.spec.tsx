import { useRouter } from "next/router";

import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
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

  const contentSectionUtils = async (user: UserEvent, title = "title") => {
    await expect(
      screen.findByRole("combobox", mocks.postTag)
    ).resolves.toBeInTheDocument();

    await user.type(screen.getByRole("textbox", mocks.titleLabel), title);
    await user.type(screen.getByRole("textbox", mocks.description), "abcd");
    await user.type(screen.getByRole("textbox", mocks.excerpt), "excerpt");

    await user.click(screen.getByRole("button", mocks.metadataNext));

    expect(
      screen.queryByRole("region", mocks.metadataRegion)
    ).not.toBeInTheDocument();

    expect(screen.getByRole("region", mocks.contentRegion)).toBeInTheDocument();

    await expect(
      screen.findByRole("button", mocks.contentNext)
    ).resolves.toBeInTheDocument();
  };

  const previewSectionUtils = async (user: UserEvent, title = "title") => {
    await contentSectionUtils(user, title);
    await user.type(screen.getByRole("textbox", mocks.content), mocks.html);
    await user.click(screen.getByRole("button", mocks.contentNext));

    expect(
      screen.queryByRole("region", mocks.contentRegion)
    ).not.toBeInTheDocument();

    expect(screen.getByRole("region", mocks.previewRegion)).toBeInTheDocument();

    await expect(
      screen.findByRole("button", mocks.previewMenuBtn)
    ).resolves.toBeInTheDocument();
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
        const imagePreviewLabel = { name: /^Post image banner preview$/i };

        await user.upload(screen.getByLabelText(mocks.imageLabel), file);

        expect(
          screen.getByLabelText(/^change image$/i)
        ).not.toHaveAccessibleErrorMessage();

        expect(screen.getByRole("img", imagePreviewLabel)).toBeInTheDocument();
      });
    });

    describe("Post tags input field", () => {
      it("On initial render, Expect the post tags combobox input field to render after fetching post tags data", async () => {
        renderUI(<CreatePostPage />);

        expect(
          screen.queryByRole("combobox", mocks.postTag)
        ).not.toBeInTheDocument();

        await expect(
          screen.findByRole("combobox", mocks.postTag)
        ).resolves.toBeInTheDocument();
      });

      it("When the post tags fetch fails or there are no created post tags, Expect a status message", async () => {
        mocks.getPostTagResolver();

        renderUI(<CreatePostPage />);

        expect(
          screen.queryByRole("combobox", mocks.postTag)
        ).not.toBeInTheDocument();

        await expect(screen.findByRole("status")).resolves.toHaveTextContent(
          mocks.postTagsErrorMsg
        );

        expect(
          screen.queryByRole("combobox", mocks.postTag)
        ).not.toBeInTheDocument();

        mocks.server.resetHandlers();
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

      it("When the API response is a PostValidationError object, Expect the respective input fields to have an error message", async () => {
        const { user } = renderUI(<CreatePostPage />);
        const { contentMsg, validate } = mocks;

        await expect(
          screen.findByRole("combobox", mocks.postTag)
        ).resolves.toBeInTheDocument();

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

        await contentSectionUtils(user);
        await user.click(screen.getByRole("button", mocks.contentNext));

        expect(
          screen.getByRole("textbox", mocks.content)
        ).toHaveAccessibleErrorMessage("Enter post content");
      });
    });

    describe("Create post section change", () => {
      it("When the user fills in the post content, Expect the page to change from the content section to the preview section", async () => {
        const { content, html } = mocks;
        const { user } = renderUI(<CreatePostPage />);

        await contentSectionUtils(user);
        await user.type(screen.getByRole("textbox", content), html);
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

        await contentSectionUtils(user, title);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.contentNext)).toBeDisabled();
        await expect(screen.findByRole("alert")).resolves.toBeInTheDocument();

        const list = screen.getByRole("list", mocks.draftValidationErrors);

        expect(within(list).getByText(message)).toBeInTheDocument();
        expect(screen.getByRole("button", mocks.draftBtn)).toBeEnabled();
        expect(screen.getByRole("button", mocks.contentNext)).toBeEnabled();
      });

      it("When the API response is a PostValidationError object, Expect an error alert list with validation error messages", async () => {
        const { validate, descriptionMsg, imageBannerMsg } = mocks;
        const { user } = renderUI(<CreatePostPage />);

        await contentSectionUtils(user, validate.title);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.contentNext)).toBeDisabled();
        await expect(screen.findByRole("alert")).resolves.toBeInTheDocument();

        const list = screen.getByRole("list", mocks.draftValidationErrors);

        expect(within(list).getAllByRole("listitem")).toHaveLength(4);
        expect(within(list).getByText(descriptionMsg)).toBeInTheDocument();
        expect(within(list).getByText(mocks.excerptMsg)).toBeInTheDocument();
        expect(within(list).getByText(mocks.tagsMsg)).toBeInTheDocument();
        expect(within(list).getByText(imageBannerMsg)).toBeInTheDocument();

        expect(
          screen.getByRole("textbox", mocks.content)
        ).toHaveAccessibleErrorMessage(mocks.contentMsg);

        expect(screen.getByRole("button", mocks.draftBtn)).toBeEnabled();
        expect(screen.getByRole("button", mocks.contentNext)).toBeEnabled();
      });
    });
  });

  describe("Post preview section", () => {
    describe("Draft post API input validation errors", () => {
      it.each(mocks.titleSlug())("%s", async (_, { title, message }) => {
        const { user } = renderUI(<CreatePostPage />);

        await previewSectionUtils(user, title);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.previewBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.previewMenuBtn)).toBeDisabled();
        await expect(screen.findByRole("alert")).resolves.toBeInTheDocument();

        const list = screen.getByRole("list", mocks.createValidationErrors);

        expect(within(list).getByText(message)).toBeInTheDocument();
        expect(screen.getByRole("button", mocks.draftBtn)).toBeEnabled();
        expect(screen.getByRole("button", mocks.previewBtn)).toBeEnabled();
        expect(screen.getByRole("button", mocks.previewMenuBtn)).toBeEnabled();
      });

      it("When the API response is a PostValidationError object, Expect an error alert list with validation error messages", async () => {
        const { validate, descriptionMsg, imageBannerMsg } = mocks;
        const { user } = renderUI(<CreatePostPage />);

        await previewSectionUtils(user, validate.title);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.previewBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.previewMenuBtn)).toBeDisabled();
        await expect(screen.findByRole("alert")).resolves.toBeInTheDocument();

        const list = screen.getByRole("list", mocks.createValidationErrors);

        expect(within(list).getAllByRole("listitem")).toHaveLength(5);
        expect(within(list).getByText(descriptionMsg)).toBeInTheDocument();
        expect(within(list).getByText(mocks.excerptMsg)).toBeInTheDocument();
        expect(within(list).getByText(mocks.contentMsg)).toBeInTheDocument();
        expect(within(list).getByText(mocks.tagsMsg)).toBeInTheDocument();
        expect(within(list).getByText(imageBannerMsg)).toBeInTheDocument();
        expect(screen.getByRole("button", mocks.draftBtn)).toBeEnabled();
        expect(screen.getByRole("button", mocks.previewBtn)).toBeEnabled();
        expect(screen.getByRole("button", mocks.previewMenuBtn)).toBeEnabled();
      });
    });

    describe("Create post API user authentication error response", () => {
      it.each(mocks.redirects)("%s", async (_, title, { url, pathname }) => {
        const { createMenuItem, dialogCancel, dialogCreate } = mocks;
        const { user } = renderUI(<CreatePostPage />);
        const router = useRouter();
        router.pathname = pathname;

        await previewSectionUtils(user, title);
        await user.click(screen.getByRole("button", mocks.previewMenuBtn));

        const menu = screen.getByRole("menu", mocks.previewMenu);

        await user.click(within(menu).getByRole("menuitem", createMenuItem));

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", dialogCreate));

        expect(within(dialog).getByRole("button", dialogCreate)).toBeDisabled();
        expect(within(dialog).getByRole("button", dialogCancel)).toBeDisabled();
        await waitFor(() => expect(router.replace).toHaveBeenCalledTimes(1));
        expect(router.replace).toHaveBeenCalledWith(url);
        expect(dialog).toBeInTheDocument();
        expect(within(dialog).getByRole("button", dialogCreate)).toBeDisabled();
        expect(within(dialog).getByRole("button", dialogCancel)).toBeDisabled();
      });
    });

    describe("Create post API error/unsupported object type response", () => {
      it.each(mocks.createAlerts)("%s", async (_, { title, message }) => {
        const { dialogCancel, dialogCreate } = mocks;
        const { user } = renderUI(<CreatePostPage />);

        await previewSectionUtils(user, title);
        await user.click(screen.getByRole("button", mocks.previewBtn));

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", dialogCreate));

        expect(within(dialog).getByRole("button", dialogCreate)).toBeDisabled();
        expect(within(dialog).getByRole("button", dialogCancel)).toBeDisabled();

        await waitForElementToBeRemoved(dialog);

        expect(screen.getByRole("alert")).toHaveTextContent(message);
      });
    });

    describe("Create post API input validation errors", () => {
      it.each(mocks.titleSlug())("%s", async (_, { title, message }) => {
        const { dialogCancel, dialogCreate } = mocks;
        const { user } = renderUI(<CreatePostPage />);

        await previewSectionUtils(user, title);
        await user.click(screen.getByRole("button", mocks.previewBtn));

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", dialogCreate));

        expect(within(dialog).getByRole("button", dialogCreate)).toBeDisabled();
        expect(within(dialog).getByRole("button", dialogCancel)).toBeDisabled();

        await waitForElementToBeRemoved(dialog);

        expect(screen.getByRole("alert")).toBeInTheDocument();

        const list = screen.getByRole("list", mocks.createValidationErrors);

        expect(within(list).getByText(message)).toBeInTheDocument();
      });

      it("When the API response is a PostValidationError object, Expect an error alert list with validation error messages", async () => {
        const { dialogCancel, dialogCreate, createMenuItem } = mocks;
        const { user } = renderUI(<CreatePostPage />);

        await previewSectionUtils(user, mocks.validate.title);
        await user.click(screen.getByRole("button", mocks.previewMenuBtn));

        const menu = screen.getByRole("menu", mocks.previewMenu);

        await user.click(within(menu).getByRole("menuitem", createMenuItem));

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", dialogCreate));

        expect(within(dialog).getByRole("button", dialogCreate)).toBeDisabled();
        expect(within(dialog).getByRole("button", dialogCancel)).toBeDisabled();

        await waitForElementToBeRemoved(dialog);

        expect(screen.getByRole("alert")).toBeInTheDocument();

        const list = screen.getByRole("list", mocks.createValidationErrors);

        expect(within(list).getAllByRole("listitem")).toHaveLength(5);
        expect(within(list).getByText(mocks.excerptMsg)).toBeInTheDocument();
        expect(within(list).getByText(mocks.contentMsg)).toBeInTheDocument();
        expect(within(list).getByText(mocks.tagsMsg)).toBeInTheDocument();

        expect(
          within(list).getByText(mocks.descriptionMsg)
        ).toBeInTheDocument();

        expect(
          within(list).getByText(mocks.imageBannerMsg)
        ).toBeInTheDocument();
      });
    });

    describe("Create post API request successfully creates and publishes a post", () => {
      afterEach(() => {
        mocks.server.resetHandlers();
      });

      it.each(mocks.saved(true))("%s", async (_, { mock, path, resolver }) => {
        mocks.server.use(http.post(/upload-image$/, resolver));

        const { user } = renderUI(<CreatePostPage />);
        const { push } = useRouter();
        const { dialogCancel, dialogCreate, titleLabel, previewRegion } = mocks;
        const file = new File(["bar"], "bar.png", { type: "image/png" });

        await expect(
          screen.findByRole("combobox", mocks.postTag)
        ).resolves.toBeInTheDocument();

        await user.type(screen.getByRole("textbox", titleLabel), mock.title);
        await user.type(screen.getByRole("textbox", mocks.description), "abcd");
        await user.type(screen.getByRole("textbox", mocks.excerpt), "excerpt");
        await user.upload(screen.getByLabelText(mocks.imageLabel), file);
        await user.click(screen.getByRole("button", mocks.metadataNext));

        expect(
          screen.queryByRole("region", mocks.metadataRegion)
        ).not.toBeInTheDocument();

        expect(
          screen.getByRole("region", mocks.contentRegion)
        ).toBeInTheDocument();

        await expect(
          screen.findByRole("button", mocks.contentNext)
        ).resolves.toBeInTheDocument();

        await user.type(screen.getByRole("textbox", mocks.content), mocks.html);
        await user.click(screen.getByRole("button", mocks.contentNext));

        expect(
          screen.queryByRole("region", mocks.contentRegion)
        ).not.toBeInTheDocument();

        expect(screen.getByRole("region", previewRegion)).toBeInTheDocument();

        await expect(
          screen.findByRole("button", mocks.previewMenuBtn)
        ).resolves.toBeInTheDocument();

        await user.click(screen.getByRole("button", mocks.previewBtn));

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", dialogCreate));

        expect(within(dialog).getByRole("button", dialogCreate)).toBeDisabled();
        expect(within(dialog).getByRole("button", dialogCancel)).toBeDisabled();
        await waitFor(() => expect(push).toHaveBeenCalledTimes(1));
        expect(push).toHaveBeenCalledWith(path);
        expect(dialog).toBeInTheDocument();
        expect(within(dialog).getByRole("button", dialogCreate)).toBeDisabled();
        expect(within(dialog).getByRole("button", dialogCancel)).toBeDisabled();
      });
    });
  });

  describe("Draft post API request responded with an error/unsupported object types", () => {
    it.each(mocks.draftAlerts)("%s", async (_, { title, message }) => {
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

      await contentSectionUtils(user, title);
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

    it.each(mocks.saved())("%s", async (_, { mock, path, resolver }) => {
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

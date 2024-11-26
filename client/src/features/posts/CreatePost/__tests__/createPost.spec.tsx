import { useRouter } from "next/router";

import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import { http } from "msw";

import CreatePostPage from "@pages/posts/new";
import { getStoragePost, saveStoragePost } from "@utils/posts/storagePost";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "./createPost.mocks";
import type { StoragePostData } from "types/posts/createPost";

type MockFn = ReturnType<typeof vi.fn<never, StoragePostData | null>>;

vi.mock("../components/Content/CKEditorComponent");
vi.mock("@utils/posts/storagePost");

describe("Create Post", () => {
  const mockFn = getStoragePost as MockFn;

  beforeAll(() => {
    mockFn.mockReturnValue(null);
    mocks.server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    mocks.server.close();
  });

  describe("UI updates", () => {
    describe("Read post from localStorage on initial render", () => {
      it("Expect no UI updates if no saved post found in localStorage", async () => {
        renderUI(<CreatePostPage />);

        await expect(
          screen.findByRole("combobox", mocks.postTag)
        ).resolves.toBeInTheDocument();

        expect(getStoragePost).toHaveBeenCalledOnce();
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();

        expect(
          screen.queryByRole("button", mocks.loadSavedPost)
        ).not.toBeInTheDocument();

        expect(
          screen.queryByRole("button", mocks.deleteSavedPost)
        ).not.toBeInTheDocument();
      });

      it("A post is saved in localStorage, Expect UI input elements to be updated with the saved post values", async () => {
        mockFn.mockReturnValueOnce(mocks.storagePost);
        mockFn.mockReturnValueOnce(mocks.storagePost);

        const { user } = renderUI(<CreatePostPage />);

        await expect(
          screen.findByRole("combobox", mocks.postTag)
        ).resolves.toBeInTheDocument();

        expect(getStoragePost).toHaveBeenCalledOnce();

        expect(screen.getByRole("alert")).toHaveTextContent(
          "It seems you have an unfinished post. Would you like to continue from where you stopped? Doing so will overwrite your current progress"
        );

        await user.click(screen.getByRole("button", mocks.loadSavedPost));
        await waitForElementToBeRemoved(() => screen.queryByRole("alert"));

        expect(screen.getByRole("textbox", mocks.titleLabel)).toHaveValue(
          "Post Title"
        );

        expect(screen.getByRole("textbox", mocks.description)).toHaveValue(
          "Post Description"
        );

        expect(screen.getByRole("textbox", mocks.excerpt)).toHaveValue(
          "Post Excerpt"
        );

        const list = screen.getByRole("list", mocks.selectedPostTags);

        expect(within(list).getAllByRole("listitem")[0]).toHaveTextContent(
          mocks.postTags[0]
        );

        expect(within(list).getAllByRole("listitem")[1]).toHaveTextContent(
          mocks.postTags[2]
        );

        expect(within(list).getAllByRole("listitem")[2]).toHaveTextContent(
          mocks.postTags[4]
        );

        await user.click(screen.getByRole("button", mocks.metadataNext));

        expect(
          screen.queryByRole("region", mocks.metadata)
        ).not.toBeInTheDocument();

        expect(screen.getByRole("region", mocks.cont)).toBeInTheDocument();

        await expect(
          screen.findByRole("button", mocks.contentNext)
        ).resolves.toBeInTheDocument();

        expect(screen.getByRole("textbox", mocks.content)).toHaveValue(
          mocks.html
        );
      });
    });

    describe("Image banner & post tags metadata", () => {
      it("Should add or remove post image banner", async () => {
        const { user } = renderUI(<CreatePostPage />);

        await expect(
          screen.findByRole("combobox", mocks.postTag)
        ).resolves.toBeInTheDocument();

        await user.upload(screen.getByLabelText(mocks.image), mocks.file);

        expect(
          screen.getByLabelText(mocks.changeImage)
        ).not.toHaveAccessibleErrorMessage();

        expect(screen.getByRole("img", mocks.imagePreview)).toBeInTheDocument();

        await user.click(screen.getByRole("button", mocks.imageBtn));

        expect(
          screen.queryByRole("img", mocks.imagePreview)
        ).not.toBeInTheDocument();
      });

      it("Should select post tags from the post tags select input", async () => {
        const { user } = renderUI(<CreatePostPage />);

        await expect(
          screen.findByRole("combobox", mocks.postTag)
        ).resolves.toBeInTheDocument();

        await user.click(screen.getByRole("combobox", mocks.postTag));
        await user.click(screen.getByRole("option", mocks.tagName(0)));
        await user.click(screen.getByRole("option", mocks.tagName(1)));
        await user.click(screen.getByRole("option", mocks.tagName(2)));
        await user.keyboard("{Escape}");

        const list = screen.getByRole("list", mocks.selectedPostTags);

        expect(within(list).getAllByRole("listitem")[0]).toHaveTextContent(
          mocks.postTags[0]
        );

        expect(within(list).getAllByRole("listitem")[1]).toHaveTextContent(
          mocks.postTags[1]
        );

        expect(within(list).getAllByRole("listitem")[2]).toHaveTextContent(
          mocks.postTags[2]
        );
      });
    });

    describe("Page sections", () => {
      it("Should be able to switch between different page sections", async () => {
        const { user } = renderUI(<CreatePostPage />);

        await expect(
          screen.findByRole("combobox", mocks.postTag)
        ).resolves.toBeInTheDocument();

        await user.type(screen.getByRole("textbox", mocks.titleLabel), "abcde");
        await user.type(screen.getByRole("textbox", mocks.description), "abcd");
        await user.type(screen.getByRole("textbox", mocks.excerpt), "abcdefgh");
        await user.click(screen.getByRole("button", mocks.metadataNext));

        expect(
          screen.queryByRole("region", mocks.metadata)
        ).not.toBeInTheDocument();

        expect(saveStoragePost).toHaveBeenCalledOnce();
        expect(screen.getByRole("region", mocks.cont)).toBeInTheDocument();

        await expect(
          screen.findByRole("button", mocks.contentNext)
        ).resolves.toBeInTheDocument();

        await user.type(screen.getByRole("textbox", mocks.content), mocks.html);
        await user.click(screen.getByRole("button", mocks.contentNext));

        expect(
          screen.queryByRole("region", mocks.cont)
        ).not.toBeInTheDocument();

        expect(saveStoragePost).toHaveBeenCalled();
        expect(screen.getByRole("region", mocks.prevs)).toBeInTheDocument();

        await expect(
          screen.findByRole("button", mocks.previewBtn)
        ).resolves.toBeInTheDocument();

        await user.click(screen.getByRole("button", mocks.prevBack));

        expect(
          screen.queryByRole("region", mocks.prevs)
        ).not.toBeInTheDocument();

        expect(screen.getByRole("region", mocks.cont)).toBeInTheDocument();

        await user.click(screen.getByRole("button", mocks.contBack));

        expect(
          screen.queryByRole("region", mocks.cont)
        ).not.toBeInTheDocument();

        expect(screen.getByRole("region", mocks.metadata)).toBeInTheDocument();
      });
    });
  });

  describe("Draft post API request", () => {
    describe("API responds with a user authentication error", () => {
      it.each(mocks.redirects)("%s", async (_, title, { pathname, url }) => {
        const router = useRouter();
        router.pathname = pathname;

        const { user } = renderUI(<CreatePostPage />);

        await expect(
          screen.findByRole("combobox", mocks.postTag)
        ).resolves.toBeInTheDocument();

        await user.type(screen.getByRole("textbox", mocks.titleLabel), title);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeDisabled();

        await waitFor(() => expect(router.replace).toHaveBeenCalledOnce());

        expect(router.replace).toHaveBeenCalledWith(url);
        expect(saveStoragePost).toHaveBeenCalledOnce();
        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeDisabled();
      });
    });

    describe("API response is an error/unsupported object type", () => {
      it.each(mocks.alerts)("%s", async (_, { title, message }) => {
        const { user } = renderUI(<CreatePostPage />);

        await expect(
          screen.findByRole("combobox", mocks.postTag)
        ).resolves.toBeInTheDocument();

        await user.type(screen.getByRole("textbox", mocks.titleLabel), title);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeDisabled();
        expect(await screen.findByRole("alert")).toHaveTextContent(message);
        expect(screen.getByRole("button", mocks.draftBtn)).toBeEnabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeEnabled();
      });
    });

    describe("API responds with an input validation error", () => {
      it("Expect input validation UI error messages", async () => {
        const { title } = mocks.validate;
        const { user } = renderUI(<CreatePostPage />);

        await expect(
          screen.findByRole("combobox", mocks.postTag)
        ).resolves.toBeInTheDocument();

        await user.type(screen.getByRole("textbox", mocks.titleLabel), title);
        await user.type(screen.getByRole("textbox", mocks.description), "abcd");
        await user.type(screen.getByRole("textbox", mocks.excerpt), "abcdefgh");
        await user.click(screen.getByRole("button", mocks.metadataNext));

        await expect(
          screen.findByRole("button", mocks.contentNext)
        ).resolves.toBeInTheDocument();

        await user.type(screen.getByRole("textbox", mocks.content), mocks.html);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.contentNext)).toBeDisabled();

        const alert = await screen.findByRole("alert");
        const list = within(alert).getByRole("list", mocks.draftErrors);

        expect(within(list).getAllByRole("listitem")[0]).toHaveTextContent(
          mocks.titleMsg
        );

        expect(within(list).getAllByRole("listitem")[1]).toHaveTextContent(
          mocks.descriptionMsg
        );

        expect(within(list).getAllByRole("listitem")[2]).toHaveTextContent(
          mocks.excerptMsg
        );

        expect(within(list).getAllByRole("listitem")[3]).toHaveTextContent(
          mocks.tagsMsg
        );

        expect(within(list).getAllByRole("listitem")[4]).toHaveTextContent(
          mocks.imageBannerMsg
        );

        expect(
          screen.getByRole("textbox", mocks.content)
        ).toHaveAccessibleErrorMessage(mocks.contentMsg);

        await user.click(screen.getByRole("button", mocks.draftErrorsBtn));
        await waitForElementToBeRemoved(list);

        expect(screen.getByRole("button", mocks.draftBtn)).toBeEnabled();
        expect(screen.getByRole("button", mocks.contentNext)).toBeEnabled();
      });
    });

    describe("Verify post title", () => {
      it.each(mocks.verifyTitle)("%s", async (_, { title, message }) => {
        const { user } = renderUI(<CreatePostPage />);
        const textbox = screen.getByRole("textbox", mocks.titleLabel);

        await user.type(textbox, title);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeDisabled();

        await waitFor(() => {
          expect(textbox).toHaveAccessibleErrorMessage(message);
        });

        expect(textbox).toHaveFocus();
        expect(screen.getByRole("button", mocks.draftBtn)).toBeEnabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeEnabled();
      });
    });

    describe("Post drafted", () => {
      it.each(mocks.drafted)("%s", async (_, { resolver, mock, url }) => {
        mocks.server.use(http.post(/upload-image$/, resolver));

        const { user } = renderUI(<CreatePostPage />);
        const { push } = useRouter();

        await expect(
          screen.findByRole("combobox", mocks.postTag)
        ).resolves.toBeInTheDocument();

        await user.type(
          screen.getByRole("textbox", mocks.titleLabel),
          mock.title
        );

        await user.upload(screen.getByLabelText(mocks.image), mocks.file);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeDisabled();

        await waitFor(() => expect(push).toHaveBeenCalledOnce());

        expect(push).toHaveBeenCalledWith(url);
        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeDisabled();
      });
    });
  });
});

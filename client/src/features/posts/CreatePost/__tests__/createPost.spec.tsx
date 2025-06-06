import {
  screen,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";

import CreatePostPage from "@pages/posts/new";
import * as mocks from "./mocks/createPost.mocks";
import * as storage from "@utils/posts/createStoragePost";
import { renderUI } from "@utils/tests/renderUI";
import type { CreateStoragePostData } from "types/posts/createPost";

type MockFn = ReturnType<typeof vi.fn<never, CreateStoragePostData | null>>;

vi.mock("../components/CreatePostContent/CreatePostContentEditor");
vi.mock("@utils/posts/createStoragePost");

describe("Create Post", () => {
  const mockGetStoragePost = storage.getCreateStoragePost as MockFn;

  beforeAll(() => {
    mockGetStoragePost.mockReturnValue(null);
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

        expect(storage.getCreateStoragePost).toHaveBeenCalledOnce();
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();

        expect(
          screen.queryByRole("button", mocks.loadSavedPost)
        ).not.toBeInTheDocument();

        expect(
          screen.queryByRole("button", mocks.deleteSavedPost)
        ).not.toBeInTheDocument();
      });

      it("A post is saved in localStorage, Expect UI input elements to be updated with the saved post values", async () => {
        mockGetStoragePost.mockReturnValueOnce(mocks.storagePost);
        mockGetStoragePost.mockReturnValueOnce(mocks.storagePost);

        const { user } = renderUI(<CreatePostPage />);

        await expect(
          screen.findByRole("combobox", mocks.postTag)
        ).resolves.toBeInTheDocument();

        expect(storage.getCreateStoragePost).toHaveBeenCalledOnce();
        expect(screen.getByRole("alert")).toHaveTextContent(mocks.storageMsg);

        await user.click(screen.getByRole("button", mocks.loadSavedPost));
        await waitForElementToBeRemoved(() => screen.queryByRole("alert"));

        expect(screen.getByRole("textbox", mocks.titleBox)).toHaveValue(
          "Post Title"
        );

        expect(screen.getByRole("textbox", mocks.descBox)).toHaveValue(
          "Post Description"
        );

        expect(screen.getByRole("textbox", mocks.extBox)).toHaveValue(
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

        expect(screen.getByRole("textbox", mocks.contBox)).toHaveValue(
          mocks.html
        );
      });
    });

    describe("Page sections", () => {
      it("Should be able to switch between different page sections", async () => {
        const { user } = renderUI(<CreatePostPage />);

        await expect(
          screen.findByRole("combobox", mocks.postTag)
        ).resolves.toBeInTheDocument();

        await user.type(screen.getByRole("textbox", mocks.titleBox), "abcde");
        await user.type(screen.getByRole("textbox", mocks.descBox), "abcd");
        await user.type(screen.getByRole("textbox", mocks.extBox), "abcdefgh");
        await user.upload(screen.getByLabelText(mocks.image), mocks.file);
        await user.click(screen.getByRole("combobox", mocks.postTag));
        await user.click(screen.getByRole("option", mocks.tagName(0)));
        await user.click(screen.getByRole("option", mocks.tagName(1)));
        await user.keyboard("{Escape}");
        await user.click(screen.getByRole("button", mocks.metadataNext));

        expect(
          screen.queryByRole("region", mocks.metadata)
        ).not.toBeInTheDocument();

        expect(storage.saveCreateStoragePost).toHaveBeenCalledOnce();
        expect(screen.getByRole("region", mocks.cont)).toBeInTheDocument();

        await expect(
          screen.findByRole("button", mocks.contentNext)
        ).resolves.toBeInTheDocument();

        await user.type(screen.getByRole("textbox", mocks.contBox), mocks.html);
        await user.click(screen.getByRole("button", mocks.contentNext));

        expect(
          screen.queryByRole("region", mocks.cont)
        ).not.toBeInTheDocument();

        expect(storage.saveCreateStoragePost).toHaveBeenCalled();
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
});

import { useRouter } from "next/router";

import { http } from "msw";
import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";

import Post from "..";
import { renderUI } from "@utils/tests/renderUI";
import * as storage from "@utils/posts/editStoragePost";
import * as mocks from "./Post.mocks";
import type { EditStoragePostData } from "types/posts/editPost";

type MockFn = ReturnType<typeof vi.fn<never, EditStoragePostData | null>>;

vi.mock("../../EditPostContent/EditPostContentEditor");
vi.mock("@utils/posts/editStoragePost");

describe("Edit Post", () => {
  const mockGetStoragePost = storage.getEditStoragePost as MockFn;
  const mockOnRendered = vi.fn().mockName("onRendered");

  beforeAll(() => {
    mockGetStoragePost.mockReturnValue(null);
  });

  describe("Read post from localStorage on initial render", () => {
    it("Expect no UI updates if no saved post found in localStorage", () => {
      renderUI(<Post {...mocks.props} onRendered={mockOnRendered} />);

      expect(storage.getEditStoragePost).toHaveBeenCalled();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();

      expect(
        screen.queryByRole("button", mocks.loadSavedPost)
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole("button", mocks.deleteSavedPost)
      ).not.toBeInTheDocument();

      expect(mockOnRendered).toHaveBeenCalledOnce();
    });

    it("Expect the alert to be removed from view if the cancel button is clicked on the storage alert", async () => {
      mockGetStoragePost.mockReturnValue(mocks.storagePost1);

      const { user } = renderUI(
        <Post {...mocks.props} onRendered={mockOnRendered} />
      );

      expect(storage.getEditStoragePost).toHaveBeenCalled();
      expect(screen.getByRole("alert")).toHaveTextContent(mocks.storageMsg1);

      await user.click(screen.getByRole("button", mocks.deleteSavedPost));
      await waitForElementToBeRemoved(() => screen.queryByRole("alert"));

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(mockOnRendered).toHaveBeenCalledOnce();
    });

    it("A post is saved in storage, Expect a redirect to the post page if the user was trying to edit another post", async () => {
      mockGetStoragePost.mockReturnValue(mocks.storagePost2);

      const { push } = useRouter();

      const { user } = renderUI(
        <Post {...mocks.props} onRendered={mockOnRendered} />
      );

      expect(storage.getEditStoragePost).toHaveBeenCalled();
      expect(screen.getByRole("alert")).toHaveTextContent(mocks.storageMsg2);
      expect(mockOnRendered).toHaveBeenCalledOnce();

      await user.click(screen.getByRole("button", mocks.loadSavedPost));
      await waitFor(() => expect(push).toHaveBeenCalledOnce());

      expect(push).toHaveBeenCalledWith(
        `/posts/edit/${mocks.storagePost2.slug}`
      );
    });

    it("Expect the content editor to be initialized with storage post content if the user already tried editing the post before", async () => {
      mockGetStoragePost.mockReturnValue(mocks.storagePost1);

      const { user } = renderUI(
        <Post
          {...mocks.props}
          onRendered={mockOnRendered}
          hasRenderedBeforeRef
        />
      );

      expect(storage.getEditStoragePost).toHaveBeenCalled();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", mocks.metadataNext));

      expect(
        screen.queryByRole("region", mocks.metadata)
      ).not.toBeInTheDocument();

      expect(screen.getByRole("region", mocks.content)).toBeInTheDocument();

      await expect(
        screen.findByRole("button", mocks.contentNext)
      ).resolves.toBeInTheDocument();

      expect(screen.getByRole("textbox", mocks.contentBox)).toHaveDisplayValue(
        mocks.storagePost1.content
      );
    });
  });

  describe("Edit post page sections", () => {
    it("Should be able to switch between the different page sections", async () => {
      const { user } = renderUI(
        <Post {...mocks.props} onRendered={mockOnRendered} />,
        { writeQuery: mocks.writeTags }
      );

      await mocks.setup(user, mocks.props.post.title);
      await user.click(screen.getByRole("button", mocks.previewBack));

      expect(
        screen.queryByRole("region", mocks.preview)
      ).not.toBeInTheDocument();

      expect(screen.getByRole("region", mocks.content)).toBeInTheDocument();

      await user.click(screen.getByRole("button", mocks.contentBack));

      expect(
        screen.queryByRole("region", mocks.content)
      ).not.toBeInTheDocument();

      expect(screen.getByRole("region", mocks.metadata)).toBeInTheDocument();
    });
  });

  describe("Edit post API request", () => {
    beforeAll(() => {
      mocks.server.listen({ onUnhandledRequest: "error" });
    });

    afterAll(() => {
      mocks.server.close();
    });

    describe("API responds with a user authentication error", () => {
      afterEach(() => {
        const router = useRouter();
        router.asPath = "/";
      });

      it.each(mocks.redirects)("%s", async (_, props, { asPath, url }) => {
        const router = useRouter();
        router.asPath = asPath;

        const { user } = renderUI(
          <Post {...props} onRendered={mockOnRendered} />,
          { writeQuery: mocks.writeTags }
        );

        await mocks.setup(user, props.post.title);
        await user.click(screen.getAllByRole("button", mocks.previewBtn)[0]);

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", mocks.edit));

        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.edit)).toBeDisabled();

        await waitFor(() => expect(router.replace).toHaveBeenCalledOnce());

        expect(router.replace).toHaveBeenCalledWith(url);
        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.edit)).toBeDisabled();
      });
    });

    describe("API response is an error/unsupported object type", () => {
      it.each(mocks.alerts)("%s", async (_, { props, message }) => {
        const { user } = renderUI(
          <Post {...props} onRendered={mockOnRendered} />,
          { writeQuery: mocks.writeTags }
        );

        await mocks.setup(user, props.post.title);
        await user.click(screen.getAllByRole("button", mocks.previewBtn)[1]);

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", mocks.edit));

        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.edit)).toBeDisabled();

        await waitForElementToBeRemoved(dialog);

        expect(screen.getByRole("alert")).toHaveTextContent(message);
      });
    });

    describe("Verify post title", () => {
      it.each(mocks.verifyTitle)("%s", async (_, { props, message }) => {
        const { user } = renderUI(
          <Post {...props} onRendered={mockOnRendered} />,
          { writeQuery: mocks.writeTags }
        );

        await mocks.setup(user, props.post.title);
        await user.click(screen.getAllByRole("button", mocks.previewBtn)[1]);

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", mocks.edit));

        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.edit)).toBeDisabled();

        await waitForElementToBeRemoved(dialog);

        const alert = screen.getByRole("alert");
        const list = within(alert).getByRole("list", mocks.errors);

        expect(within(list).getByRole("listitem")).toHaveTextContent(message);
      });
    });

    describe("API responds with an input validation error", () => {
      it("Expect an alert with a list of all relevant error messages", async () => {
        const { user } = renderUI(
          <Post {...mocks.validate.props} onRendered={mockOnRendered} />,
          { writeQuery: mocks.writeTags }
        );

        await mocks.setup(user, mocks.validate.props.post.title);
        await user.click(screen.getAllByRole("button", mocks.previewBtn)[0]);

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", mocks.edit));

        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.edit)).toBeDisabled();

        await waitForElementToBeRemoved(dialog);

        const alert = screen.getByRole("alert");
        const list = within(alert).getByRole("list", mocks.errors);

        expect(within(list).getAllByRole("listitem")[0]).toHaveTextContent(
          mocks.titleError
        );

        expect(within(list).getAllByRole("listitem")[1]).toHaveTextContent(
          mocks.descriptionError
        );

        expect(within(list).getAllByRole("listitem")[2]).toHaveTextContent(
          mocks.excerptError
        );

        expect(within(list).getAllByRole("listitem")[3]).toHaveTextContent(
          mocks.contentError
        );

        expect(within(list).getAllByRole("listitem")[4]).toHaveTextContent(
          mocks.tagIdsError
        );

        expect(within(list).getAllByRole("listitem")[5]).toHaveTextContent(
          mocks.imageBannerError
        );

        expect(within(list).getAllByRole("listitem")[6]).toHaveTextContent(
          mocks.idError
        );

        expect(within(list).getAllByRole("listitem")[7]).toHaveTextContent(
          mocks.editStatusError
        );

        await user.click(screen.getByRole("button", mocks.hideErrorsBtn));
        await waitForElementToBeRemoved(alert);
      });
    });

    describe("Unknown post", () => {
      it("The blog post does not exist, Expect a redirect to the posts page", async () => {
        const { replace } = useRouter();

        const { user } = renderUI(
          <Post {...mocks.unknown.props} onRendered={mockOnRendered} />,
          { writeQuery: mocks.writeTags }
        );

        await mocks.setup(user, mocks.unknown.props.post.title);
        await user.click(screen.getAllByRole("button", mocks.previewBtn)[1]);

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", mocks.edit));

        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.edit)).toBeDisabled();

        await waitFor(() => expect(replace).toHaveBeenCalledOnce());

        expect(replace).toHaveBeenCalledWith({
          pathname: "/posts",
          query: { status: "unknown" },
        });

        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.edit)).toBeDisabled();
      });
    });

    describe("Edit post", () => {
      it("Should edit the post even if the image banner upload fails", async () => {
        mocks.server.use(http.post(/upload-image$/, mocks.editUploadFail));

        const { push } = useRouter();

        const { user } = renderUI(
          <Post {...mocks.edited1.props} onRendered={mockOnRendered} />,
          { writeQuery: mocks.writeTags }
        );

        await user.upload(screen.getByLabelText(mocks.image), mocks.file);
        await mocks.setup(user, mocks.edited1.props.post.title);
        await user.click(screen.getAllByRole("button", mocks.previewBtn)[0]);

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", mocks.edit));

        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.edit)).toBeDisabled();

        await waitFor(() => expect(push).toHaveBeenCalledOnce());

        expect(push).toHaveBeenCalledWith({
          pathname: "/posts/view/post-title",
          query: { edit: true },
        });

        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.edit)).toBeDisabled();
      });

      it("Should edit the post with an image banner upload and a new title", async () => {
        mocks.server.use(http.post(/upload-image$/, mocks.editUpload));

        const { replace } = useRouter();

        const { user } = renderUI(
          <Post {...mocks.edited2.props} onRendered={mockOnRendered} />,
          { writeQuery: mocks.writeTags }
        );

        await user.upload(screen.getByLabelText(mocks.image), mocks.file);
        await mocks.setup(user, mocks.edited2.props.post.title);
        await user.click(screen.getAllByRole("button", mocks.previewBtn)[0]);

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", mocks.edit));

        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.edit)).toBeDisabled();

        await waitFor(() => expect(replace).toHaveBeenCalledOnce());

        expect(replace).toHaveBeenCalledWith({
          pathname: "/posts/view/new-post-title",
          query: { edit: false },
        });

        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.edit)).toBeDisabled();
      });
    });
  });
});

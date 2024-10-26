import { useRouter } from "next/router";

import {
  screen,
  within,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { http } from "msw";

import Preview from "..";
import * as mocks from "./Preview.mocks";
import { renderUI } from "@utils/tests/renderUI";

describe("Create Post - Preview", () => {
  const mockDispatch = vi.fn().mockName("dispatch");
  const mockHandleDraftPost = vi.fn().mockName("handleDraftPost");
  const mockHandleCloseDraftError = vi.fn().mockName("handleCloseDraftError");

  const UI = (props: mocks.Props) => {
    const { title, imageBanner, tagIds, draftErrors, draftStatus } = props;

    return (
      <Preview
        post={{
          content: mocks.html,
          description: "Post Description",
          excerpt: "Post Excerpt",
          title,
          imageBanner,
          tagIds,
        }}
        draftStatus={draftStatus}
        draftErrors={draftErrors}
        handleDraftPost={mockHandleDraftPost}
        handleCloseDraftError={mockHandleCloseDraftError}
        dispatch={mockDispatch}
      />
    );
  };

  describe("Preview blog post", () => {
    it("Should render the provided post metadata and content", () => {
      renderUI(<UI {...mocks.previewProps} />, { writeQuery: mocks.writeTags });

      const aside = screen.getByRole("complementary");
      const info = within(aside).getByRole("list", mocks.postInfo);
      const tags = within(aside).getByRole("list", mocks.postTags);
      const article = screen.getByRole("article");

      expect(within(info).getAllByRole("listitem")[0]).toHaveTextContent(
        "Post Description"
      );

      expect(within(info).getAllByRole("listitem")[1]).toHaveTextContent(
        "Post Excerpt"
      );

      expect(within(tags).getAllByRole("listitem")[0]).toHaveTextContent(
        "Tag 1"
      );

      expect(within(tags).getAllByRole("listitem")[1]).toHaveTextContent(
        "Tag 2"
      );

      expect(within(tags).getAllByRole("listitem")[2]).toHaveTextContent(
        "Tag 4"
      );

      expect(within(tags).getAllByRole("listitem")[3]).toHaveTextContent(
        "Tag 5"
      );

      expect(within(article).getAllByRole("heading")[0]).toHaveTextContent(
        "Post Title"
      );

      expect(
        within(article).getByRole("img", mocks.postImg)
      ).toBeInTheDocument();

      expect(
        within(article).getByRole("region", mocks.postContent)
      ).toContainHTML(mocks.html);
    });
  });

  describe("Draft post", () => {
    it("Should display any draft post input validation errors", async () => {
      const { user } = renderUI(<UI {...mocks.draftErrorsProps} />);

      const alert = screen.getByRole("alert");
      const list = within(alert).getByRole("list", mocks.draftErrors);

      expect(within(list).getAllByRole("listitem")[0]).toHaveTextContent(
        "Post title error"
      );

      expect(within(list).getAllByRole("listitem")[1]).toHaveTextContent(
        "Post description error"
      );

      expect(within(list).getAllByRole("listitem")[2]).toHaveTextContent(
        "Post excerpt error"
      );

      expect(within(list).getAllByRole("listitem")[3]).toHaveTextContent(
        "Post content error"
      );

      expect(within(list).getAllByRole("listitem")[4]).toHaveTextContent(
        "Post tags error"
      );

      expect(within(list).getAllByRole("listitem")[5]).toHaveTextContent(
        "Post image banner error"
      );

      await user.click(within(alert).getByRole("button", mocks.closeDraft));

      expect(mockHandleCloseDraftError).toHaveBeenCalledOnce();
    });

    it("Expect a draft post API request when the 'Save to Draft' button is clicked", async () => {
      const { user } = renderUI(<UI {...mocks.props} />);

      await user.click(screen.getByRole("button", mocks.draftBtn));

      expect(mockHandleDraftPost).toHaveBeenCalledOnce();
    });

    it("Expect a draft post API request when the 'Save Post As Draft' menu item is clicked", async () => {
      const { user } = renderUI(<UI {...mocks.props} />);

      await user.click(screen.getByRole("button", mocks.previewMenu));
      await user.click(screen.getByRole("menuitem", mocks.menuDraft));

      expect(mockHandleDraftPost).toHaveBeenCalledOnce();
    });
  });

  describe("Create post API request", () => {
    beforeAll(() => {
      mocks.server.listen({ onUnhandledRequest: "error" });
    });

    afterAll(() => {
      mocks.server.close();
    });

    describe("API responds with a user authentication error", () => {
      it.each(mocks.redirects)("%s", async (_, title, { url, pathname }) => {
        const { user } = renderUI(<UI {...mocks.createProps(title)} />);
        const router = useRouter();
        router.pathname = pathname;

        await user.click(screen.getByRole("button", mocks.previewMenu));
        await user.click(screen.getByRole("menuitem", mocks.menuCreate));

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", mocks.publish));

        expect(
          within(dialog).getByRole("button", mocks.publish)
        ).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();

        await waitFor(() => expect(router.replace).toHaveBeenCalledOnce());

        expect(router.replace).toHaveBeenCalledWith(url);
        expect(dialog).toBeInTheDocument();
        expect(
          within(dialog).getByRole("button", mocks.publish)
        ).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();
      });
    });

    describe("API response is an error/unsupported object type", () => {
      it.each(mocks.alerts)("%s", async (_, { title, message }) => {
        const { user } = renderUI(<UI {...mocks.createProps(title)} />);

        await user.click(screen.getByRole("button", mocks.create));

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", mocks.publish));

        expect(
          within(dialog).getByRole("button", mocks.publish)
        ).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();

        await waitForElementToBeRemoved(dialog);

        expect(screen.getByRole("alert")).toHaveTextContent(message);
      });
    });

    describe("Verify post title", () => {
      it.each(mocks.verifyTitle)("%s", async (_, { title, message }) => {
        const { user } = renderUI(<UI {...mocks.createProps(title)} />);

        await user.click(screen.getByRole("button", mocks.create));

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", mocks.publish));

        expect(
          within(dialog).getByRole("button", mocks.publish)
        ).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();

        await waitForElementToBeRemoved(dialog);

        const alert = screen.getByRole("alert");
        const list = within(alert).getByRole("list", mocks.createErrors);

        expect(within(list).getByRole("listitem")).toHaveTextContent(message);
      });
    });

    describe("API responds with an input validation error", () => {
      it("Expect an alert with a list of all relevant error messages", async () => {
        const { validate: mock } = mocks;
        const { user } = renderUI(<UI {...mocks.createProps(mock.title)} />);

        await user.click(screen.getByRole("button", mocks.previewMenu));
        await user.click(screen.getByRole("menuitem", mocks.menuCreate));

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", mocks.publish));

        expect(
          within(dialog).getByRole("button", mocks.publish)
        ).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();

        await waitForElementToBeRemoved(dialog);

        const alert = screen.getByRole("alert");
        const list = within(alert).getByRole("list", mocks.createErrors);

        expect(within(list).getAllByRole("listitem")[0]).toHaveTextContent(
          mocks.descriptionMsg
        );

        expect(within(list).getAllByRole("listitem")[1]).toHaveTextContent(
          mocks.excerptMsg
        );

        expect(within(list).getAllByRole("listitem")[2]).toHaveTextContent(
          mocks.contentMsg
        );

        expect(within(list).getAllByRole("listitem")[3]).toHaveTextContent(
          mocks.tagsMsg
        );

        expect(within(list).getAllByRole("listitem")[4]).toHaveTextContent(
          mocks.imageBannerMsg
        );

        await user.click(within(alert).getByRole("button", mocks.closeCreate));
        await waitForElementToBeRemoved(alert);
      });
    });

    describe("Post created", () => {
      it.each(mocks.created)("%s", async (_, { resolver, mock, url }) => {
        mocks.server.use(http.post(/upload-image$/, resolver));

        const { user } = renderUI(<UI {...mocks.savedProps(mock.title)} />);
        const { push } = useRouter();

        await user.click(screen.getByRole("button", mocks.create));

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", mocks.publish));

        expect(
          within(dialog).getByRole("button", mocks.publish)
        ).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();

        await waitFor(() => expect(push).toHaveBeenCalledOnce());

        expect(push).toHaveBeenCalledWith(url);
        expect(dialog).toBeInTheDocument();
        expect(
          within(dialog).getByRole("button", mocks.publish)
        ).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();
      });
    });
  });
});

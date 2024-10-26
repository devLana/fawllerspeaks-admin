import { useRouter } from "next/router";

import { graphql } from "msw";
import { screen, waitFor } from "@testing-library/react";

import GetPostTags from "..";
import { PostTagsPageContext } from "@context/PostTags";
import { GET_POST_TAGS } from "@queries/getPostTags/GET_POST_TAGS";
import * as mocks from "./getPostTags.mocks";
import { renderUI } from "@utils/tests/renderUI";

vi.mock("../components/PostTags");

describe("View/Get post tags", () => {
  const UI = (
    <PostTagsPageContext.Provider value={{ handleOpenAlert: vi.fn() }}>
      <h1 id="page-title">Post Tags</h1>
      <GetPostTags id="page-title" />
    </PostTagsPageContext.Provider>
  );

  beforeAll(() => {
    mocks.server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    mocks.server.close();
  });

  describe("GetPostTags API response is a user authentication error", () => {
    it.each(mocks.redirects)("%s", async (_, data, resolver) => {
      const router = useRouter();
      router.pathname = data.pathname;

      mocks.server.use(graphql.query(GET_POST_TAGS, resolver));
      renderUI(UI);

      expect(screen.getByRole("progressbar", mocks.label)).toBeInTheDocument();

      await waitFor(() => expect(router.replace).toHaveBeenCalledOnce());

      expect(router.replace).toHaveBeenCalledWith(data.params);
      expect(screen.getByRole("progressbar", mocks.label)).toBeInTheDocument();
    });
  });

  describe("API response should display a status message", () => {
    it.each(mocks.alerts)("%s", async (_, message, resolver) => {
      mocks.server.use(graphql.query(GET_POST_TAGS, resolver));

      renderUI(UI);

      expect(screen.getByRole("progressbar", mocks.label)).toBeInTheDocument();
      expect(await screen.findByRole("status")).toHaveTextContent(message);

      expect(
        screen.queryByRole("progressbar", mocks.label)
      ).not.toBeInTheDocument();
    });
  });

  describe("Get all post tags", () => {
    it("Expect a list of post tags to be rendered", async () => {
      mocks.server.use(graphql.query(GET_POST_TAGS, mocks.all));

      renderUI(UI);

      expect(screen.getByRole("progressbar", mocks.label)).toBeInTheDocument();
      expect(await screen.findByText(/^Post Tags List$/i)).toBeInTheDocument();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();

      expect(
        screen.queryByRole("progressbar", mocks.label)
      ).not.toBeInTheDocument();
    });
  });
});

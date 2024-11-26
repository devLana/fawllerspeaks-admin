import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import GetPosts from "@pages/posts/[[...postsPage]]";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "./getPosts.mocks";

vi.mock("../components/Posts");

describe("Get Posts Page", () => {
  beforeAll(() => {
    mocks.server.listen({ onUnhandledRequest: "error" });
  });

  afterEach(() => {
    const router = useRouter();
    router.asPath = "/";
  });

  afterAll(() => {
    mocks.server.close();
  });

  describe("GetPosts API request gets a user authentication error response", () => {
    it.each(mocks.redirects)("%s", async (_, mock, requestHandler) => {
      const router = useRouter();
      router.asPath = mock.asPath;

      mocks.server.use(requestHandler);
      renderUI(<GetPosts />);

      expect(screen.getByRole("progressbar", mocks.load)).toBeInTheDocument();

      await waitFor(() => expect(router.replace).toHaveBeenCalledOnce());

      expect(router.replace).toHaveBeenCalledWith(mock.params);
      expect(screen.getByRole("progressbar", mocks.load)).toBeInTheDocument();
    });
  });

  describe("API response is an error or an unsupported object type", () => {
    it.each(mocks.alerts)("%s", async (_, msg, handler) => {
      const router = useRouter();
      router.asPath = "/posts";

      mocks.server.use(handler);
      renderUI(<GetPosts />);

      expect(screen.getByRole("progressbar", mocks.load)).toBeInTheDocument();

      await expect(screen.findByRole("status")).resolves.toHaveTextContent(msg);

      expect(
        screen.queryByRole("progressbar", mocks.load)
      ).not.toBeInTheDocument();
    });
  });

  describe("Get all posts", () => {
    it("Should render a list of blog posts", async () => {
      const router = useRouter();
      router.asPath = "/posts";

      mocks.server.use(mocks.posts);
      renderUI(<GetPosts />);

      expect(screen.getByRole("progressbar", mocks.load)).toBeInTheDocument();
      expect(await screen.findByText(/^Posts List Page$/i)).toBeInTheDocument();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();

      expect(
        screen.queryByRole("progressbar", mocks.load)
      ).not.toBeInTheDocument();
    });
  });
});

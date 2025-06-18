import { useRouter } from "next/router";

import { screen, waitFor, within } from "@testing-library/react";

import GetPosts from "@pages/posts/[[...params]]";
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
    router.query = {};
  });

  afterAll(() => {
    mocks.server.close();
  });

  describe("Search params validation", () => {
    it("Expect the provided search params to be properly validated", () => {
      const router = useRouter();
      router.asPath = "/posts/NEXT/cursor?status=DrafTs&sort=TITLE_Down";

      router.query = {
        status: "DrafTs",
        sort: "TITLE_Down",
        params: ["NEXT", "cursor"],
      };

      renderUI(<GetPosts />);

      const status = screen.getByRole("status");
      const list = within(status).getByRole("list");

      expect(status).toHaveTextContent(mocks.PARAMS_MSG);

      expect(within(list).getAllByRole("listitem")[0]).toHaveTextContent(
        "sort: TITLE_Down"
      );

      expect(within(list).getAllByRole("listitem")[1]).toHaveTextContent(
        "status: DrafTs"
      );

      expect(within(list).getAllByRole("listitem")[2]).toHaveTextContent(
        "type: NEXT"
      );
    });
  });

  describe("GetPosts API request gets a user authentication error response", () => {
    it.each(mocks.redirects)("%s", async (_, mock, requestHandler) => {
      const router = useRouter();
      router.asPath = mock.asPath;
      router.query = mock.query;

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
      router.asPath = "/posts/before/cursor?status=Published&sort=title_desc";

      router.query = {
        params: ["before", "cursor"],
        status: "Published",
        sort: "title_desc",
      };

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
      router.asPath = "/posts/after/cursor1234";
      router.query = { params: ["after", "cursor1234"] };

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

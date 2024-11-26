import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import ViewPost from "@pages/posts/view/[slug]";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "./viewPost.mocks";

vi.mock("../PostWrapper");
vi.mock("../Post");

describe("View Post Page", () => {
  beforeAll(() => {
    mocks.server.listen({ onUnhandledRequest: "error" });
  });

  afterEach(() => {
    const router = useRouter();
    router.query = {};
  });

  afterAll(() => {
    mocks.server.close();
  });

  describe("Read an existing post from cache", () => {
    it("Should render a cached posted without making a network request", () => {
      const router = useRouter();
      router.asPath = `/posts/view/${mocks.postSlug}`;
      router.query = { slug: mocks.postSlug };

      renderUI(<ViewPost />, { writeQuery: mocks.writePost });

      expect(screen.getByRole("region", mocks.region)).toContainHTML(mocks.htm);

      expect(
        screen.queryByRole("progressbar", mocks.load)
      ).not.toBeInTheDocument();
    });
  });

  describe("View post API request", () => {
    describe("API request gets a user authentication error response", () => {
      it.each(mocks.redirects)("%s", async (_, slug, { asPath, url }) => {
        const router = useRouter();
        router.asPath = asPath;
        router.query = { slug };

        renderUI(<ViewPost />);

        expect(screen.getByRole("progressbar", mocks.load)).toBeInTheDocument();

        await waitFor(() => expect(router.replace).toHaveBeenCalledOnce());

        expect(router.replace).toHaveBeenCalledWith(url);
        expect(screen.getByRole("progressbar", mocks.load)).toBeInTheDocument();
      });
    });

    describe("The API response returns an error message", () => {
      it.each(mocks.alerts)("%s", async (_, asPath, { slug, message }) => {
        const router = useRouter();
        router.asPath = asPath;
        router.query = { slug };

        renderUI(<ViewPost />);

        expect(screen.getByRole("progressbar", mocks.load)).toBeInTheDocument();
        expect(await screen.findByRole("status")).toHaveTextContent(message);

        expect(
          screen.queryByRole("progressbar", mocks.load)
        ).not.toBeInTheDocument();
      });
    });

    describe("The API response is the requested blog post", () => {
      it("Expect the blog post details to be rendered", async () => {
        const router = useRouter();
        router.asPath = `/posts/view/${mocks.get.slug}`;
        router.query = { slug: mocks.get.slug };

        renderUI(<ViewPost />);

        expect(screen.getByRole("progressbar", mocks.load)).toBeInTheDocument();
        expect(await screen.findByText(/^view post$/i)).toBeInTheDocument();

        expect(
          screen.queryByRole("progressbar", mocks.load)
        ).not.toBeInTheDocument();
      });
    });
  });
});

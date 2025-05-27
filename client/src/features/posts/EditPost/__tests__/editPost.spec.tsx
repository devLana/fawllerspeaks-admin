import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import EditPost from "@pages/posts/edit/[slug]";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "./editPost.mocks";

vi.mock("../components/Post");

describe("Edit Post Page", () => {
  afterEach(() => {
    const router = useRouter();
    router.query = {};
  });

  describe("Read post from cache", () => {
    it("Should render the post to edit using cached post data without making a network request", () => {
      const router = useRouter();
      router.asPath = `/posts/edit/${mocks.postSlug}`;
      router.query = { slug: mocks.postSlug };

      renderUI(<EditPost />, { writeQuery: mocks.writePost });

      expect(screen.queryByRole("status")).not.toBeInTheDocument();

      expect(
        screen.queryByRole("progressbar", mocks.load)
      ).not.toBeInTheDocument();

      expect(screen.getByRole("article", mocks.article)).toContainHTML(
        mocks.html
      );
    });
  });

  describe("Edit post query API request", () => {
    beforeAll(() => {
      mocks.server.listen({ onUnhandledRequest: "error" });
    });

    afterAll(() => {
      mocks.server.close();
    });

    describe("API request receives a user authentication error response", () => {
      it.each(mocks.redirects)("%s", async (_, slug, { asPath, url }) => {
        const router = useRouter();
        router.asPath = asPath;
        router.query = { slug };

        renderUI(<EditPost />);

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

        renderUI(<EditPost />);

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
        router.asPath = `/posts/edit/${mocks.get.slug}`;
        router.query = { slug: mocks.get.slug };

        renderUI(<EditPost />);

        expect(screen.getByRole("progressbar", mocks.load)).toBeInTheDocument();

        expect(
          await screen.findByText(/^edit post page component$/i)
        ).toBeInTheDocument();

        expect(
          screen.queryByRole("progressbar", mocks.load)
        ).not.toBeInTheDocument();
      });
    });
  });
});

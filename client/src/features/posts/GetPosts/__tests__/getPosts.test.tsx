import { useRouter } from "next/router";

import { screen } from "@testing-library/react";

import GetPosts from "@pages/posts/[[...postsPage]]";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "../utils/getPosts.mocks";

describe("Get Posts Page", () => {
  describe("Get status param url query on redirect from other pages", () => {
    afterAll(() => {
      const router = useRouter();
      router.query = {};
    });

    it.each(mocks.redirectStatus)("%s", (_, status, message) => {
      const router = useRouter();
      router.query = { status };

      renderUI(<GetPosts />);

      expect(screen.getByRole("alert")).toHaveTextContent(message);
    });
  });

  describe("API responses", () => {
    it.todo("");
  });
});

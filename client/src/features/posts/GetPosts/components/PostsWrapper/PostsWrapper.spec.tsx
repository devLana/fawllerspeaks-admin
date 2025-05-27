import { useRouter } from "next/router";

import { screen } from "@testing-library/react";

import PostsWrapper from ".";
import { renderUI } from "@utils/tests/renderUI";

describe("GetPosts page wrapper", () => {
  afterAll(() => {
    const router = useRouter();
    router.query = {};
  });

  it.each([
    [
      "Expect an alert message if an an attempt was made to edit an unknown post",
      { status: "unknown" },
      "It seems the post you tried to edit no longer exists",
    ],
  ])("%s", (_, query, message) => {
    const router = useRouter();
    router.query = query;

    renderUI(<PostsWrapper id="view-post-page" ariaBusy={false} />);

    expect(screen.getByRole("alert")).toHaveTextContent(message);
  });
});

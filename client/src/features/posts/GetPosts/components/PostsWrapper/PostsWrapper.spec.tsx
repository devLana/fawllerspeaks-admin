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
      "Expect an alert message if an attempt was made to edit an unknown post",
      { message: "unknown" },
      "It seems the post you tried to edit no longer exists",
    ],
    [
      "Expect an alert message if there was an error trying to recover an edited post from local storage",
      { message: "edit-load-error" },
      "There was an error trying to recover your saved post. The saved data appears to be corrupted or incomplete",
    ],
  ])("%s", (_, query, message) => {
    const router = useRouter();
    router.query = query;

    renderUI(<PostsWrapper id="view-post-page" ariaBusy={false} />);

    expect(screen.getByRole("alert")).toHaveTextContent(message);
  });
});

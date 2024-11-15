import { useRouter } from "next/router";

import { screen } from "@testing-library/react";

import PostWrapper from "../PostWrapper";
import { renderUI } from "@utils/tests/renderUI";

describe("ViewPost page, On redirect from create post page", () => {
  afterAll(() => {
    const router = useRouter();
    router.query = {};
  });

  it.each([
    [
      "Expect an alert message if a post was drafted with an image upload error",
      { draft: "true" },
      "Blog post saved as draft. But there was an error uploading your post image banner. Please try uploading an image later",
    ],
    [
      "Expect an alert message if a post was successfully drafted",
      { draft: "false" },
      "Blog post saved as draft",
    ],
    [
      "Expect an alert message if a post was created and published with an image upload error",
      { create: "true" },
      "Blog post created and published. But there was an error uploading your post image banner. Please try uploading an image later",
    ],
    [
      "Expect an alert message if a post was successfully created and published",
      { create: "false" },
      "Blog post created and published",
    ],
  ])("%s", (_, query, message) => {
    const router = useRouter();
    router.query = query;

    renderUI(<PostWrapper label="View post page" />);

    expect(screen.getByRole("alert")).toHaveTextContent(message);
  });
});

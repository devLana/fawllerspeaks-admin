// import { useRouter } from "next/router";

// import { screen, waitFor, within } from "@testing-library/react";
// import { graphql } from "msw";

// import CreatePostPage from "@pages/posts/new";
// import { renderUI } from "@utils/tests/renderUI";
// import * as mocks from "../utils/createPost.mocks";

describe("Create blog post", () => {
  describe("Post metadata", () => {
    describe("Validate metadata user input", () => {
      it.todo(
        "Input fields should have an error message if their values are empty strings"
      );

      it.todo(
        "Post author should not be able to upload non-image files for the banner image"
      );

      it.todo(
        "Post author should be able to upload only one image banner file at a time"
      );
    });
  });

  describe("Post content", () => {
    it.todo(
      "Should display the post content editor after entering the post metadata information"
    );

    it.todo(
      "Should display an alert message if the author tries to proceed without entering a post content"
    );
  });

  describe("Post preview", () => {
    it.todo("Should display the post preview after entering the post content");
  });

  describe("Publish post api request", () => {
    it.todo(
      "Should display error messages if the post payload failed input validation"
    );

    it.todo("Should redirect to the login page if the author is not logged in");
    it.todo(
      "Should redirect to the login page if the author could not be verified"
    );
    it.todo(
      "Should redirect to the register page if the author's account is not registered"
    );

    it.todo(
      "Should display an alert message if the request failed with a network error"
    );
    it.todo(
      "Should display an alert message if the api throws a graphql error"
    );
    it.todo("Should display an alert message if the post title already exists");
    it.todo(
      "Should display an alert message if an unknown post tag id was passed"
    );

    it.todo("Should create a new post and redirect to the posts page");
  });

  describe("Save post as draft", () => {
    //Client side form validation
    it.todo(
      "Post title input field should have an error message if the author tries to save a post without a title as draft"
    );

    // api request
    it.todo(
      "Should display error messages if the post payload failed input validation"
    );

    it.todo("Should redirect to the login page if the author is not logged in");
    it.todo(
      "Should redirect to the login page if the author could not be verified"
    );
    it.todo(
      "Should redirect to the register page if the author's account is not registered"
    );

    it.todo(
      "Should display an alert message if the request failed with a network error"
    );
    it.todo(
      "Should display an alert message if the api throws a graphql error"
    );
    it.todo(
      "Should display an alert message if an unknown post tag id was passed"
    );
  });
});

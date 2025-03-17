import { reducer, initialState as state } from ".";
import type { CreatePostStateData } from "types/posts/createPost";

describe("Create Post - State Reducer", () => {
  describe("Go back to different 'view' states", () => {
    const state1: CreatePostStateData = { ...state, view: "content" };
    const state2: CreatePostStateData = { ...state, view: "preview" };

    it("Should change the 'view' state back to metadata", () => {
      const data = reducer(state1, { type: "GO_BACK_TO_METADATA" });
      expect(data).toStrictEqual({ ...state1, view: "metadata" });
    });

    it("Should change the 'view' state back to content", () => {
      const data = reducer(state2, { type: "GO_BACK_TO_CONTENT" });
      expect(data).toStrictEqual({ ...state2, view: "content" });
    });
  });

  describe("Proceed to post content", () => {
    it("Should add post metadata data to 'postData' and change 'view' to content", () => {
      const metadata = {
        title: "New Title",
        description: "New Description",
        excerpt: "New Excerpt",
        imageBanner: new File(["image"], "avatar.jpg", { type: "image/jpeg" }),
        tagIds: ["id-1", "id-2"],
      };

      const data = reducer(state, {
        type: "PROCEED_TO_POST_CONTENT",
        payload: { metadata },
      });

      expect(data).toStrictEqual({
        ...state,
        view: "content",
        postData: { ...state.postData, ...metadata },
      });
    });
  });

  describe("Post content", () => {
    it("Should add provided post content to 'postData'", () => {
      const content = "<h2>Heading</h2><p>Paragraph 1</p><h3>Heading 3</h3>";

      const initState: CreatePostStateData = {
        ...state,
        view: "content",
        postData: { ...state.postData, content },
      };

      const data = reducer(initState, {
        type: "ADD_POST_CONTENT",
        payload: { content },
      });

      expect(data).toStrictEqual({
        ...initState,
        postData: { ...initState.postData, content },
      });
    });
  });

  describe("Preview post", () => {
    it("Should change 'view' to preview", () => {
      const file = new File(["image"], "avatar.jpg", { type: "image/jpeg" });

      const initState: CreatePostStateData = {
        view: "content",
        postData: {
          title: "New Title",
          description: "New Description",
          excerpt: "New Excerpt",
          content: "<h2>Heading</h2><p>Paragraph 1</p><h3>Heading 3</h3>",
          imageBanner: file,
          tagIds: ["id-1", "id-2"],
        },
        showStoragePostAlert: false,
      };

      const data = reducer(initState, { type: "PREVIEW_POST" });

      expect(data).toStrictEqual({ ...initState, view: "preview" });
    });
  });

  describe("StoragePost state", () => {
    const post = {
      title: "Blog Post Title",
      description: "Post Description",
      excerpt: "Post Excerpt",
      tagIds: ["id-1", "id-2"],
      content: "<p>paragraph</p>",
    };

    it("Should set 'storagePost' state", () => {
      const result = reducer(state, { type: "SHOW_STORAGE_POST_ALERT" });
      expect(result).toStrictEqual({ ...state, showStoragePostAlert: true });
    });

    it("Should unset 'storagePost' state", () => {
      const initState = { ...state, showStoragePostAlert: true };
      const result = reducer(initState, { type: "HIDE_STORAGE_POST_ALERT" });

      expect(result).toStrictEqual(state);
    });

    it("Should load 'storagePost' state into 'postData' state", () => {
      const initState = { ...state, showStoragePostAlert: true };

      const result = reducer(initState, {
        type: "LOAD_STORAGE_POST",
        payload: { post },
      });

      expect(result).toStrictEqual({
        ...state,
        postData: { ...post, imageBanner: null },
      });
    });
  });
});

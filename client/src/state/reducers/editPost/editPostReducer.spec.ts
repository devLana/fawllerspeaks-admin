import { reducer } from ".";
import type { EditPostState as State } from "types/posts/editPost";

describe("Edit Post - State Reducer", () => {
  const state: State = {
    view: "metadata",
    showStoragePostAlert: false,
    postData: {
      id: "id-1",
      title: "title",
      description: "description",
      excerpt: "excerpt",
      content: "",
      imageBanner: { url: null, file: null },
      tagIds: [],
      editStatus: false,
    },
  };

  describe("Go back to different 'view' states", () => {
    const state1: State = { ...state, view: "content" };
    const state2: State = { ...state, view: "preview" };

    it("Should change the 'view' state back to metadata", () => {
      const result = reducer(state1, { type: "GO_BACK_TO_METADATA" });
      expect(result).toStrictEqual({ ...state1, view: "metadata" });
    });

    it("Should change the 'view' state back to content", () => {
      const result = reducer(state2, { type: "GO_BACK_TO_CONTENT" });
      expect(result).toStrictEqual({ ...state2, view: "content" });
    });
  });

  describe("Post image banner file url link", () => {
    it("Should remove the 'url' of a post's 'imageBanner'", () => {
      const initState = {
        ...state,
        postData: {
          ...state.postData,
          imageBanner: { file: null, url: "https://image_file.com/file.jpg" },
        },
      };

      const data = reducer(initState, { type: "REMOVE_IMAGE_BANNER_URL" });

      expect(data).toStrictEqual({
        ...initState,
        postData: {
          ...initState.postData,
          imageBanner: { url: null, file: null },
        },
      });
    });
  });

  describe("Proceed to post content", () => {
    const file = new File(["image"], "avatar.jpg", { type: "image/jpeg" });

    const metadata = {
      title: "New Title",
      description: "New Description",
      excerpt: "New Excerpt",
      imageBanner: file,
      tagIds: ["id-1", "id-2"],
      editStatus: true,
    };

    it("Should add post metadata data to 'postData' and change 'view' to content", () => {
      const data = reducer(state, {
        type: "PROCEED_TO_POST_CONTENT",
        payload: { metadata },
      });

      expect(data).toStrictEqual({
        ...state,
        view: "content",
        postData: {
          ...state.postData,
          ...metadata,
          imageBanner: { file, url: state.postData.imageBanner.url },
        },
      });
    });

    it("Should add post metadata data to 'postData', change 'view' to content and change storageAlert state to 'false'", () => {
      const initState: State = { ...state, showStoragePostAlert: true };

      const data = reducer(initState, {
        type: "PROCEED_TO_POST_CONTENT",
        payload: { metadata },
      });

      expect(data).toStrictEqual({
        ...state,
        view: "content",
        postData: {
          ...state.postData,
          ...metadata,
          imageBanner: { file, url: state.postData.imageBanner.url },
        },
        showStoragePostAlert: false,
      });
    });
  });

  describe("Post content", () => {
    it("Should add provided post content to 'postData'", () => {
      const content = "<h2>Heading</h2><p>Paragraph 1</p><h3>Heading 3</h3>";

      const initState: State = {
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

  describe("Preview edited post", () => {
    const state1: State = {
      view: "content",
      showStoragePostAlert: false,
      postData: {
        id: "id-1",
        title: "New Title",
        description: "New Description",
        excerpt: "New Excerpt",
        content: "<h2>Heading</h2><p>Paragraph 1</p><h3>Heading 3</h3>",
        imageBanner: { url: null, file: null },
        tagIds: ["id-1", "id-2"],
        editStatus: true,
      },
    };

    it("Should change 'view' state to preview", () => {
      const initState = {
        ...state1,
        postData: {
          ...state1.postData,
          imageBanner: {
            url: null,
            file: new File(["image"], "avatar.jpg", { type: "image/jpeg" }),
          },
        },
      };

      const data = reducer(initState, { type: "PREVIEW_POST" });

      expect(data).toStrictEqual({ ...initState, view: "preview" });
    });
  });

  describe("StoragePost state", () => {
    const initState = { ...state, showStoragePostAlert: true };

    it("Should set 'storagePost' alert state to true", () => {
      const result = reducer(state, { type: "SHOW_EDIT_STORAGE_POST_ALERT" });
      expect(result).toStrictEqual({ ...state, showStoragePostAlert: true });
    });

    it("Should set 'storagePost' alert state to false", () => {
      const result = reducer(initState, {
        type: "HIDE_EDIT_STORAGE_POST_ALERT",
      });

      expect(result).toStrictEqual(state);
    });

    it("Should load storage post content data into 'postData' state", () => {
      const result = reducer(initState, {
        type: "LOAD_EDIT_STORAGE_POST",
        payload: { content: "<p>paragraph</p>" },
      });

      expect(result).toStrictEqual({
        ...state,
        postData: { ...state.postData, content: "<p>paragraph</p>" },
      });
    });
  });
});

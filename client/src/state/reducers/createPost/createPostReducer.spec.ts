import { reducer, initialState as state } from ".";

describe("Create Post - State Reducer", () => {
  describe("View state", () => {
    it("Should change the 'view' state", () => {
      const result1 = reducer(state, {
        type: "CHANGE_VIEW",
        payload: { view: "content" },
      });

      expect(result1).toStrictEqual({ ...state, view: "content" });

      const result2 = reducer(state, {
        type: "CHANGE_VIEW",
        payload: { view: "preview" },
      });

      expect(result2).toStrictEqual({ ...state, view: "preview" });

      const result3 = reducer(state, {
        type: "CHANGE_VIEW",
        payload: { view: "metadata" },
      });

      expect(result3).toStrictEqual({ ...state, view: "metadata" });
    });
  });

  describe("PostData state", () => {
    it("Should set the values for the required metadata fields in the 'postData' state", () => {
      const data = {
        description: "description",
        excerpt: "excerpt",
        title: "title",
      };

      const result = reducer(state, {
        type: "ADD_REQUIRED_METADATA",
        payload: { metadata: data },
      });

      expect(result).toStrictEqual({
        view: "content",
        storageData: { open: false, post: {} },
        postData: { ...data, content: "" },
      });
    });

    it("Should change the value of a required metadata field in the 'postData' state", () => {
      const initState = {
        ...state,
        postData: { ...state.postData, description: "description" },
      };

      const result = reducer(initState, {
        type: "CHANGE_METADATA_FIELD",
        payload: { key: "description", value: "new description" },
      });

      expect(result).toStrictEqual({
        view: "metadata",
        storageData: { open: false, post: {} },
        postData: { ...state.postData, description: "new description" },
      });
    });

    it("Should add an image to the 'postData' state", () => {
      const file = new File(["test image file"], "avatar.jpg", {
        type: "image/jpeg",
      });

      const result = reducer(state, {
        type: "ADD_POST_BANNER_IMAGE",
        payload: { imageFile: file },
      });

      expect(result).toStrictEqual({
        view: "metadata",
        storageData: { open: false, post: {} },
        postData: {
          ...state.postData,
          imageBanner: {
            file,
            blobUrl: expect.stringMatching(/^data:/) as string,
          },
        },
      });
    });

    it("Should remove an image from the 'postData' state", () => {
      const file = new File(["test image file"], "avatar.jpg", {
        type: "image/jpeg",
      });

      const blobUrl = window.URL.createObjectURL(file);

      const initState = {
        ...state,
        postData: { ...state.postData, imageBanner: { file, blobUrl } },
      };

      const result = reducer(initState, { type: "REMOVE_POST_BANNER_IMAGE" });

      expect(result).toStrictEqual(state);
    });

    it("Should add post tag(s) to the 'postData' state", () => {
      const result = reducer(state, {
        type: "MANAGE_POST_TAGS",
        payload: { tagIds: ["id-1", "id-2", "id-3"] },
      });

      expect(result).toStrictEqual({
        view: "metadata",
        storageData: { open: false, post: {} },
        postData: { ...state.postData, tagIds: ["id-1", "id-2", "id-3"] },
      });
    });

    it("Should remove post tag(s) from the 'postData' state", () => {
      const result = reducer(state, {
        type: "MANAGE_POST_TAGS",
        payload: { tagIds: [] },
      });

      expect(result).toStrictEqual(state);
    });

    it("Should add post content to the 'postData' state", () => {
      const content = "<p>post content html</p>";

      const result = reducer(state, {
        type: "ADD_POST_CONTENT",
        payload: { content },
      });

      expect(result).toStrictEqual({
        view: "metadata",
        storageData: { open: false, post: {} },
        postData: { ...state.postData, content },
      });

      expect(result.postData).toHaveProperty("content", content);
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
      const result = reducer(state, {
        type: "SET_STORAGE_POST",
        payload: { post },
      });

      expect(result).toStrictEqual({
        view: "metadata",
        storageData: { open: true, post },
        postData: { title: "", description: "", excerpt: "", content: "" },
      });
    });

    it("Should unset 'storagePost' state", () => {
      const initState = { ...state, storageData: { open: true, post } };
      const result = reducer(initState, { type: "UNSET_STORAGE_POST" });

      expect(result).toStrictEqual({
        view: "metadata",
        storageData: { open: false, post: {} },
        postData: { title: "", description: "", excerpt: "", content: "" },
      });
    });

    it("Should load 'storagePost' state into 'postData' state", () => {
      const initState = { ...state, storageData: { open: true, post } };

      const result = reducer(initState, {
        type: "LOAD_STORAGE_POST",
        payload: { post },
      });

      expect(result).toStrictEqual({
        view: "metadata",
        storageData: { open: false, post: {} },
        postData: post,
      });
    });
  });
});

import { reducer, initialState as state } from ".";

describe("Create Post - State Reducer", () => {
  describe("View state", () => {
    it("Should change the 'view' state", () => {
      const result1 = reducer(state, {
        type: "CHANGE_VIEW",
        payload: { view: "content" },
      });

      expect(result1).toHaveProperty("view", "content");

      const result2 = reducer(state, {
        type: "CHANGE_VIEW",
        payload: { view: "preview" },
      });

      expect(result2).toHaveProperty("view", "preview");

      const result3 = reducer(state, {
        type: "CHANGE_VIEW",
        payload: { view: "metadata" },
      });

      expect(result3).toHaveProperty("view", "metadata");
    });
  });

  describe("PostData state", () => {
    it("Should set the values for the required metadata fields in the 'postData' state", () => {
      const result = reducer(state, {
        type: "ADD_REQUIRED_METADATA",
        payload: {
          metadata: {
            description: "description",
            excerpt: "excerpt",
            title: "title",
          },
        },
      });

      expect(result.postData).toHaveProperty("title", "title");
      expect(result.postData).toHaveProperty("description", "description");
      expect(result.postData).toHaveProperty("excerpt", "excerpt");
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

      expect(result.postData).toHaveProperty("description", "new description");
    });

    it("Should add an image to the 'postData' state", () => {
      const file = new File(["test image file"], "avatar.jpg", {
        type: "image/jpeg",
      });

      const result = reducer(state, {
        type: "ADD_POST_BANNER_IMAGE",
        payload: { imageFile: file },
      });

      expect(result.postData).toHaveProperty("imageBanner.file", file);

      expect(result.postData).toHaveProperty(
        "imageBanner.blobUrl",
        expect.stringMatching(/^data:/)
      );
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

      expect(result.postData).not.toHaveProperty("imageBanner");
    });

    it("Should add post tag(s) to the 'postData' state", () => {
      const result = reducer(state, {
        type: "MANAGE_POST_TAGS",
        payload: { tagIds: ["id-1", "id-2", "id-3"] },
      });

      expect(result.postData).toHaveProperty(
        "tagIds",
        expect.arrayContaining(["id-1", "id-2", "id-3"])
      );
    });

    it("Should remove post tag(s) from the 'postData' state", () => {
      const result = reducer(state, {
        type: "MANAGE_POST_TAGS",
        payload: { tagIds: [] },
      });

      expect(result.postData).not.toHaveProperty("tagIds");
    });

    it("Should add post content to the 'postData' state", () => {
      const content = "<p>post content html</p>";

      const result = reducer(state, {
        type: "ADD_POST_CONTENT",
        payload: { content },
      });

      expect(result.postData).toHaveProperty("content", content);
    });
  });
});

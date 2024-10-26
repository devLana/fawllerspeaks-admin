import { reducer, initialState as state } from ".";

describe("Post Tags List - State Reducer", () => {
  describe("Edit state", () => {
    it("Should set the edit state", () => {
      const result = reducer(state, {
        type: "OPEN_EDIT",
        payload: { name: "edit name", id: "edit-id" },
      });

      expect(result).toStrictEqual({
        edit: { open: true, name: "edit name", id: "edit-id" },
        delete: { open: false, name: "", ids: [] },
        selectedTags: {},
      });
    });

    it("Should reset the edit state", () => {
      const result = reducer(state, { type: "CLOSE_EDIT" });

      expect(result).toStrictEqual({
        edit: { open: false, name: "", id: "" },
        delete: { open: false, name: "", ids: [] },
        selectedTags: {},
      });
    });

    it("Post tag edited, Should reset the edit state and update the tag name if the post tag is selected", () => {
      const initState = {
        ...state,
        edit: { open: true, name: "tag name", id: "tag-id" },
        selectedTags: { "tag-id": "tag name" },
      };

      const result = reducer(initState, {
        type: "POST_TAG_EDITED",
        payload: { name: "new tag name", id: "tag-id" },
      });

      expect(result).toStrictEqual({
        edit: { open: false, name: "", id: "" },
        delete: { open: false, name: "", ids: [] },
        selectedTags: { "tag-id": "new tag name" },
      });
    });

    it("Post tag edited, Should reset the edit state but not modify the selectedTags if the post tag is not selected", () => {
      const initState1 = {
        ...state,
        edit: { open: true, name: "tag name", id: "tag-id" },
        selectedTags: {},
      };

      const result1 = reducer(initState1, {
        type: "POST_TAG_EDITED",
        payload: { name: "new tag name", id: "tag-id" },
      });

      expect(result1).toStrictEqual({
        edit: { open: false, name: "", id: "" },
        delete: { open: false, name: "", ids: [] },
        selectedTags: {},
      });

      const initState2 = {
        ...state,
        edit: { open: true, name: "tag name", id: "tag-id" },
        selectedTags: { "tag-id": "tag name" },
      };

      const result2 = reducer(initState2, {
        type: "POST_TAG_EDITED",
        payload: { name: "other tag name", id: "other-tag-id" },
      });

      expect(result2).toStrictEqual({
        edit: { open: false, name: "", id: "" },
        delete: { open: false, name: "", ids: [] },
        selectedTags: { "tag-id": "tag name" },
      });
    });
  });

  describe("Delete state", () => {
    it("Should set the delete state", () => {
      const result = reducer(state, {
        type: "OPEN_DELETE",
        payload: { name: "delete name", ids: ["delete-1", "delete-2"] },
      });

      expect(result).toStrictEqual({
        edit: { open: false, name: "", id: "" },
        delete: {
          open: true,
          name: "delete name",
          ids: ["delete-1", "delete-2"],
        },
        selectedTags: {},
      });
    });

    it("Should reset the delete state", () => {
      const result = reducer(state, { type: "CLOSE_DELETE" });

      expect(result).toStrictEqual({
        edit: { open: false, name: "", id: "" },
        delete: { open: false, name: "", ids: [] },
        selectedTags: {},
      });
    });

    it("Post tags deleted, Expect all deleted post tags to be removed from selectedTags", () => {
      const initState1 = {
        ...state,
        delete: { open: true, ids: ["tag-1"], name: "tag 1" },
        selectedTags: {},
      };

      const result1 = reducer(initState1, {
        type: "REMOVE_POST_TAG_ON_DELETE",
        payload: { tagIds: ["tag-1"] },
      });

      expect(result1).toStrictEqual({
        edit: { open: false, name: "", id: "" },
        delete: { open: false, name: "", ids: [] },
        selectedTags: {},
      });

      const initState2 = {
        ...state,
        delete: { open: true, ids: ["tag-1"], name: "tag 1" },
        selectedTags: { "tag-1": "tag 1" },
      };

      const result2 = reducer(initState2, {
        type: "REMOVE_POST_TAG_ON_DELETE",
        payload: { tagIds: ["tag-1"] },
      });

      expect(result2).toStrictEqual({
        edit: { open: false, name: "", id: "" },
        delete: { open: false, name: "", ids: [] },
        selectedTags: {},
      });
    });
  });

  describe("Select post tags", () => {
    it("Should add a post tag to selectedTags", () => {
      const result = reducer(state, {
        type: "SELECT_POST_TAG",
        payload: { checked: true, name: "selected tag", id: "id-1" },
      });

      expect(result).toStrictEqual({
        edit: { open: false, name: "", id: "" },
        delete: { open: false, name: "", ids: [] },
        selectedTags: { "id-1": "selected tag" },
      });
    });

    it("Should remove a post tag from selectedTags", () => {
      const initState = {
        ...state,
        selectedTags: { "id-1": "selected tag" },
      };

      const result = reducer(initState, {
        type: "SELECT_POST_TAG",
        payload: { checked: false, id: "id-1", name: "selected tag" },
      });

      expect(result).toStrictEqual({
        edit: { open: false, name: "", id: "" },
        delete: { open: false, name: "", ids: [] },
        selectedTags: {},
      });
    });

    it("Should add all post tags to selectedTags", () => {
      const result = reducer(state, {
        type: "SELECT_ALL_POST_TAGS",
        payload: {
          shouldSelectAll: true,
          tags: [
            { name: "selected tag 1", id: "id-1" },
            { name: "selected tag 2", id: "id-2" },
          ],
        },
      });

      expect(result).toStrictEqual({
        edit: { open: false, name: "", id: "" },
        delete: { open: false, name: "", ids: [] },
        selectedTags: { "id-1": "selected tag 1", "id-2": "selected tag 2" },
      });
    });

    it("Should remove all post tags from selectedTags", () => {
      const initState = {
        ...state,
        selectedTags: { "id-1": "selected tag 1", "id-2": "selected tag 2" },
      };

      const result = reducer(initState, {
        type: "SELECT_ALL_POST_TAGS",
        payload: {
          shouldSelectAll: false,
          tags: [
            { name: "selected tag 1", id: "id-1" },
            { name: "selected tag 2", id: "id-2" },
          ],
        },
      });

      expect(result).toStrictEqual({
        edit: { open: false, name: "", id: "" },
        delete: { open: false, name: "", ids: [] },
        selectedTags: {},
      });
    });

    it("Should add a range of post tags to selectedTags", () => {
      const initState = { ...state, selectedTags: { "id-1": "tag 1" } };

      const result = reducer(initState, {
        type: "SHIFT_PLUS_CLICK",
        payload: {
          anchorTagId: "id-1",
          anchorTagIndex: 0,
          targetIndex: 3,
          tags: [
            { name: "tag 1", id: "id-1" },
            { name: "tag 2", id: "id-2" },
            { name: "tag 3", id: "id-3" },
            { name: "tag 4", id: "id-4" },
            { name: "tag 5", id: "id-5" },
          ],
        },
      });

      expect(result).toStrictEqual({
        edit: { open: false, name: "", id: "" },
        delete: { open: false, name: "", ids: [] },
        selectedTags: {
          "id-1": "tag 1",
          "id-2": "tag 2",
          "id-3": "tag 3",
          "id-4": "tag 4",
        },
      });
    });

    it("Should remove a range of post tags from selectedTags", () => {
      const initState = {
        ...state,
        selectedTags: {
          "id-2": "tag 2",
          "id-1": "tag 1",
          "id-4": "tag 4",
          "id-5": "tag 5",
        },
      };

      const result = reducer(initState, {
        type: "SHIFT_PLUS_CLICK",
        payload: {
          anchorTagId: "id-3",
          anchorTagIndex: 2,
          targetIndex: 0,
          tags: [
            { name: "tag 1", id: "id-1" },
            { name: "tag 2", id: "id-2" },
            { name: "tag 3", id: "id-3" },
            { name: "tag 4", id: "id-4" },
            { name: "tag 5", id: "id-5" },
          ],
        },
      });

      expect(result).toStrictEqual({
        edit: { open: false, name: "", id: "" },
        delete: { open: false, name: "", ids: [] },
        selectedTags: { "id-4": "tag 4", "id-5": "tag 5" },
      });
    });
  });
});

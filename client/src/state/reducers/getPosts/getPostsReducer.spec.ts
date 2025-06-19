import { reducer, initialState as state } from ".";
import type { PostsPagePostData } from "types/posts/getPosts";

describe("Get Posts List - State Reducer", () => {
  describe("Posts list view state", () => {
    it("Should change the 'view' state", () => {
      const result1 = reducer(state, {
        type: "CHANGE_POST_LIST_VIEW",
        payload: { view: "list" },
      });

      expect(result1).toStrictEqual({
        postsView: "list",
        delete: { open: false, title: "", ids: [] },
        selectedPosts: {},
      });

      const result2 = reducer(state, {
        type: "CHANGE_POST_LIST_VIEW",
        payload: { view: "grid" },
      });

      expect(result2).toStrictEqual({
        postsView: "grid",
        delete: { open: false, title: "", ids: [] },
        selectedPosts: {},
      });
    });
  });

  describe("Delete State", () => {
    it("Should set the 'delete' state", () => {
      const result = reducer(state, {
        type: "OPEN_DELETE",
        payload: { title: "post title", ids: ["post-1", "post-2"] },
      });

      expect(result).toStrictEqual({
        postsView: "grid",
        delete: { open: true, title: "post title", ids: ["post-1", "post-2"] },
        selectedPosts: {},
      });
    });

    it("Should reset the 'delete' state", () => {
      const result = reducer(state, { type: "CLOSE_DELETE" });

      expect(result).toStrictEqual({
        postsView: "grid",
        delete: { open: false, title: "", ids: [] },
        selectedPosts: {},
      });
    });
  });

  describe("Select posts", () => {
    const posts1: PostsPagePostData[] = [
      {
        title: "Post Title 1",
        id: "id-1",
        dateCreated: new Date().toISOString(),
        status: "Published",
        url: { slug: "post-title-1" },
        imageBanner: null,
      },
      {
        title: "Post Title 2",
        id: "id-2",
        dateCreated: new Date().toISOString(),
        status: "Unpublished",
        url: { slug: "post-title-2" },
        imageBanner: null,
      },
      {
        title: "Post Title 3",
        id: "id-3",
        dateCreated: new Date().toISOString(),
        status: "Published",
        url: { slug: "post-title-3" },
        imageBanner: null,
      },
    ];

    const posts2: PostsPagePostData[] = [
      ...posts1,
      {
        title: "Post Title 4",
        id: "id-4",
        dateCreated: new Date().toISOString(),
        status: "Unpublished",
        url: { slug: "post-title-4" },
        imageBanner: null,
      },
      {
        title: "Post Title 5",
        id: "id-5",
        dateCreated: new Date().toISOString(),
        status: "Unpublished",
        url: { slug: "post-title-5" },
        imageBanner: null,
      },
      {
        title: "Post Title 6",
        id: "id-6",
        dateCreated: new Date().toISOString(),
        status: "Unpublished",
        url: { slug: "post-title-6" },
        imageBanner: null,
      },
    ];

    describe("Select/unselect a post", () => {
      it("Should add a post to the 'selectedPosts' state", () => {
        const result = reducer(state, {
          type: "SELECT_POST",
          payload: { checked: true, title: "Post Title", id: "post-id-1" },
        });

        expect(result).toStrictEqual({
          postsView: "grid",
          delete: { open: false, title: "", ids: [] },
          selectedPosts: { "post-id-1": "Post Title" },
        });
      });

      it("Should remove a post from the 'selectedPosts' state", () => {
        const initState = {
          ...state,
          selectedPosts: { "post-id-1": "Post Title" },
        };

        const result = reducer(initState, {
          type: "SELECT_POST",
          payload: { checked: false, title: "Post Title", id: "post-id-1" },
        });

        expect(result).toStrictEqual({
          postsView: "grid",
          delete: { open: false, title: "", ids: [] },
          selectedPosts: {},
        });
      });
    });

    describe("Select/unselect all posts", () => {
      it("Should add all posts to 'selectedPosts'", () => {
        const result = reducer(state, {
          type: "TOGGLE_ALL_POSTS_SELECT",
          payload: { posts: posts1 },
        });

        expect(result).toStrictEqual({
          postsView: "grid",
          delete: { open: false, title: "", ids: [] },
          selectedPosts: {
            "id-1": "Post Title 1",
            "id-2": "Post Title 2",
            "id-3": "Post Title 3",
          },
        });
      });

      it("Should remove all posts from 'selectedPosts'", () => {
        const initState = {
          ...state,
          selectedPosts: {
            "id-1": "Post Title 1",
            "id-2": "Post Title 2",
            "id-3": "Post Title 3",
          },
        };

        const result = reducer(initState, {
          type: "TOGGLE_ALL_POSTS_SELECT",
          payload: { posts: posts1 },
        });

        expect(result).toStrictEqual({
          postsView: "grid",
          delete: { open: false, title: "", ids: [] },
          selectedPosts: {},
        });
      });
    });

    describe("Select/unselect a range of posts from the list", () => {
      it("Should add a range of posts to 'selectedPosts'", () => {
        const initState = {
          ...state,
          selectedPosts: { "id-1": "Post Title 1", "id-2": "Post Title 2" },
        };

        const result = reducer(initState, {
          type: "SHIFT_PLUS_CLICK",
          payload: {
            anchorPost: { id: "id-2", index: 1 },
            targetIndex: 4,
            prevTargetIndex: null,
            posts: posts2,
          },
        });

        expect(result).toStrictEqual({
          postsView: "grid",
          delete: { open: false, title: "", ids: [] },
          selectedPosts: {
            "id-1": "Post Title 1",
            "id-2": "Post Title 2",
            "id-3": "Post Title 3",
            "id-4": "Post Title 4",
            "id-5": "Post Title 5",
          },
        });
      });

      it("Should remove a range of posts from 'selectedPosts'", () => {
        const initState = {
          ...state,
          selectedPosts: {
            "id-2": "Post Title 2",
            "id-3": "Post Title 3",
            "id-5": "Post Title 5",
          },
        };

        const result = reducer(initState, {
          type: "SHIFT_PLUS_CLICK",
          payload: {
            anchorPost: { id: "id-4", index: 3 },
            targetIndex: 0,
            prevTargetIndex: null,
            posts: posts2,
          },
        });

        expect(result).toStrictEqual({
          postsView: "grid",
          delete: { open: false, title: "", ids: [] },
          selectedPosts: { "id-5": "Post Title 5" },
        });
      });

      it("Selects all posts from the same anchor post to a new target post, Expect all selected posts after the current target post to be unselected", () => {
        const initState = {
          ...state,
          selectedPosts: {
            "id-1": "Post Title 1",
            "id-2": "Post Title 2",
            "id-3": "Post Title 3",
            "id-4": "Post Title 4",
            "id-5": "Post Title 5",
            "id-6": "Post Title 6",
          },
        };

        const result = reducer(initState, {
          type: "SHIFT_PLUS_CLICK",
          payload: {
            anchorPost: { id: "id-1", index: 0 },
            targetIndex: 3,
            prevTargetIndex: 5,
            posts: posts2,
          },
        });

        expect(result).toStrictEqual({
          postsView: "grid",
          delete: { open: false, title: "", ids: [] },
          selectedPosts: {
            "id-1": "Post Title 1",
            "id-2": "Post Title 2",
            "id-3": "Post Title 3",
            "id-4": "Post Title 4",
          },
        });
      });

      it("Selects all posts from the same anchor post to a new target post, Expect all selected posts before the current target post to be unselected", () => {
        const initState = {
          ...state,
          selectedPosts: {
            "id-1": "Post Title 1",
            "id-2": "Post Title 2",
            "id-3": "Post Title 3",
            "id-4": "Post Title 4",
            "id-5": "Post Title 5",
            "id-6": "Post Title 6",
          },
        };

        const result = reducer(initState, {
          type: "SHIFT_PLUS_CLICK",
          payload: {
            anchorPost: { id: "id-6", index: 5 },
            targetIndex: 2,
            prevTargetIndex: 0,
            posts: posts2,
          },
        });

        expect(result).toStrictEqual({
          postsView: "grid",
          delete: { open: false, title: "", ids: [] },
          selectedPosts: {
            "id-5": "Post Title 5",
            "id-6": "Post Title 6",
            "id-3": "Post Title 3",
            "id-4": "Post Title 4",
          },
        });
      });

      it("Selects the anchor post and all posts before it, Expect all previously selected posts after the anchor post to be unselected", () => {
        const initState = {
          ...state,
          selectedPosts: {
            "id-3": "Post Title 3",
            "id-4": "Post Title 4",
            "id-5": "Post Title 5",
            "id-6": "Post Title 6",
          },
        };

        const result = reducer(initState, {
          type: "SHIFT_PLUS_CLICK",
          payload: {
            anchorPost: { id: "id-3", index: 2 },
            targetIndex: 0,
            prevTargetIndex: 5,
            posts: posts2,
          },
        });

        expect(result).toStrictEqual({
          postsView: "grid",
          delete: { open: false, title: "", ids: [] },
          selectedPosts: {
            "id-1": "Post Title 1",
            "id-2": "Post Title 2",
            "id-3": "Post Title 3",
          },
        });
      });

      it("Selects the anchor post and all posts after it, Expect all previously selected posts before the anchor post to be unselected", () => {
        const initState = {
          ...state,
          selectedPosts: {
            "id-1": "Post Title 1",
            "id-2": "Post Title 2",
            "id-3": "Post Title 3",
            "id-4": "Post Title 4",
          },
        };

        const result = reducer(initState, {
          type: "SHIFT_PLUS_CLICK",
          payload: {
            anchorPost: { id: "id-3", index: 2 },
            targetIndex: 5,
            prevTargetIndex: 0,
            posts: posts2,
          },
        });

        expect(result).toStrictEqual({
          postsView: "grid",
          delete: { open: false, title: "", ids: [] },
          selectedPosts: {
            "id-3": "Post Title 3",
            "id-4": "Post Title 4",
            "id-5": "Post Title 5",
            "id-6": "Post Title 6",
          },
        });
      });
    });
  });
});

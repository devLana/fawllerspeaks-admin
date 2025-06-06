import { EDIT_STORAGE_POST, getEditStoragePost, saveEditStoragePost } from ".";

describe("LocalStorage Edit Post Data", () => {
  const postData = {
    id: "post-id-1",
    slug: "blog-post-title",
    content: "<h2>Blog Post Content</h2><p>Blog post paragraph</p>",
    imgUrls: ["img-1", "img-2", "img-3"],
  };

  describe("Get edit post data from localStorage", () => {
    afterAll(() => {
      localStorage.removeItem(EDIT_STORAGE_POST);
    });

    it("Expect null if no post data is saved to localStorage", () => {
      expect(getEditStoragePost()).toBeNull();
    });

    it("Expect null if the saved post data is an empty object", () => {
      localStorage.setItem(EDIT_STORAGE_POST, JSON.stringify({}));
      expect(getEditStoragePost()).toBeNull();
    });

    it("Expect null if the saved post data does not have any of the required post properties", () => {
      localStorage.setItem(
        EDIT_STORAGE_POST,
        JSON.stringify({ title: "Post Title" })
      );

      expect(getEditStoragePost()).toBeNull();
    });

    it("The saved post has both expected & unexpected properties, Expect the returned post to contain only the expected properties", () => {
      localStorage.setItem(
        EDIT_STORAGE_POST,
        JSON.stringify({
          ...postData,
          title: "Blog Post Title",
          excerpt: "Blog Post Excerpt",
        })
      );

      expect(getEditStoragePost()).toStrictEqual(postData);
    });

    it("Should return all saved post data in the localStorage", () => {
      localStorage.setItem(EDIT_STORAGE_POST, JSON.stringify(postData));
      expect(getEditStoragePost()).toStrictEqual(postData);
    });
  });

  describe("Save edit post data to localStorage", () => {
    afterEach(() => {
      localStorage.removeItem(EDIT_STORAGE_POST);
    });

    it("Expect all provided post data to be saved to localStorage", () => {
      saveEditStoragePost(postData);

      const postString = localStorage.getItem(EDIT_STORAGE_POST) as string;
      const savedPost = JSON.parse(postString) as object;

      expect(savedPost).toStrictEqual(postData);
    });

    it("Expect an already saved post data in localStorage to be updated properly", () => {
      const { content, ...data } = postData;

      localStorage.setItem(EDIT_STORAGE_POST, JSON.stringify(data));
      saveEditStoragePost({ content });

      const postString = localStorage.getItem(EDIT_STORAGE_POST) as string;
      const savedPost = JSON.parse(postString) as object;

      expect(savedPost).toStrictEqual(postData);
    });

    it("Expect 'content' and 'imgUrls' to be removed from storage post if an empty content string and an empty imgUrls array is passed", () => {
      const { content: _, imgUrls: __, ...data } = postData;

      localStorage.setItem(EDIT_STORAGE_POST, JSON.stringify(postData));
      saveEditStoragePost({ content: "", imgUrls: [] });

      const postString = localStorage.getItem(EDIT_STORAGE_POST) as string;
      const savedPost = JSON.parse(postString) as object;

      expect(savedPost).toStrictEqual(data);
    });
  });
});

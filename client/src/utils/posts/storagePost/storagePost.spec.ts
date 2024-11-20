import { STORAGE_POST, getStoragePost, saveStoragePost } from ".";

describe("LocalStorage Post Data", () => {
  const postData = {
    title: "Blog Post Title",
    description: "Blog Post Description",
    excerpt: "Blog Post Excerpt",
    tagIds: ["id-1", "id-2", "id-3"],
    content: "<h2>Blog Post Content</h2><p>Blog post paragraph</p>",
  };

  describe("Get post data from localStorage", () => {
    afterAll(() => {
      localStorage.removeItem(STORAGE_POST);
    });

    it("Expect null if no post data is saved to localStorage", () => {
      expect(getStoragePost()).toBeNull();
    });

    it("Expect null if the saved post data is an empty object", () => {
      localStorage.setItem(STORAGE_POST, JSON.stringify({}));
      expect(getStoragePost()).toBeNull();
    });

    it("Expect null if the saved post data does not have the right post properties", () => {
      localStorage.setItem(STORAGE_POST, JSON.stringify({ name: "John Doe" }));
      expect(getStoragePost()).toBeNull();
    });

    it("Saved post has expected & unexpected properties, Expect the returned posts to contain only the expected properties", () => {
      localStorage.setItem(
        STORAGE_POST,
        JSON.stringify({
          name: "John Doe",
          title: "Blog Post Title",
          age: 15,
          excerpt: "Blog Post Excerpt",
        })
      );

      expect(getStoragePost()).toStrictEqual({
        title: "Blog Post Title",
        excerpt: "Blog Post Excerpt",
      });
    });

    it("Should return all saved post data in the localStorage", () => {
      localStorage.setItem(STORAGE_POST, JSON.stringify(postData));
      expect(getStoragePost()).toStrictEqual(postData);
    });
  });

  describe("Save post data to localStorage", () => {
    afterEach(() => {
      localStorage.removeItem(STORAGE_POST);
    });

    it("Should save all provided post data to localStorage", () => {
      saveStoragePost(postData);

      const postString = localStorage.getItem(STORAGE_POST) as string;
      const savedPost = JSON.parse(postString) as object;

      expect(savedPost).toStrictEqual(postData);
    });

    it("Should update an already saved post data in localStorage", () => {
      const { content, ...data } = postData;

      localStorage.setItem(STORAGE_POST, JSON.stringify(data));
      saveStoragePost({ content });

      const postString = localStorage.getItem(STORAGE_POST) as string;
      const savedPost = JSON.parse(postString) as object;

      expect(savedPost).toStrictEqual(postData);
    });
  });
});

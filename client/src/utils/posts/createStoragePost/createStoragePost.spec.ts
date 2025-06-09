import {
  CREATE_STORAGE_POST,
  getCreateStoragePost,
  saveCreateStoragePost,
} from ".";

describe("LocalStorage Create Post Data", () => {
  const postData = {
    title: "Blog Post Title",
    description: "Blog Post Description",
    excerpt: "Blog Post Excerpt",
    tagIds: ["id-1", "id-2", "id-3"],
    content: "<h2>Blog Post Content</h2><p>Blog post paragraph</p>",
  };

  describe("Get create post data from localStorage", () => {
    afterAll(() => {
      localStorage.removeItem(CREATE_STORAGE_POST);
    });

    it("Expect null if no post data is saved to localStorage", () => {
      expect(getCreateStoragePost()).toBeNull();
    });

    it("Expect null if the saved post data is an empty object", () => {
      localStorage.setItem(CREATE_STORAGE_POST, JSON.stringify({}));
      expect(getCreateStoragePost()).toBeNull();
    });

    it("Expect null if the saved post data does not have the right post properties", () => {
      localStorage.setItem(
        CREATE_STORAGE_POST,
        JSON.stringify({ name: "John Doe" })
      );

      expect(getCreateStoragePost()).toBeNull();
    });

    it("The saved post has both expected & unexpected properties, Expect the returned post to contain only the expected properties", () => {
      localStorage.setItem(
        CREATE_STORAGE_POST,
        JSON.stringify({
          name: "John Doe",
          title: "Blog Post Title",
          age: 15,
          excerpt: "Blog Post Excerpt",
        })
      );

      expect(getCreateStoragePost()).toStrictEqual({
        title: "Blog Post Title",
        excerpt: "Blog Post Excerpt",
      });
    });

    it("Should return all saved post data in the localStorage", () => {
      localStorage.setItem(CREATE_STORAGE_POST, JSON.stringify(postData));
      expect(getCreateStoragePost()).toStrictEqual(postData);
    });
  });

  describe("Save create post data to localStorage", () => {
    afterEach(() => {
      localStorage.removeItem(CREATE_STORAGE_POST);
    });

    it("Expect all provided input post data to be saved to localStorage", () => {
      saveCreateStoragePost(postData);

      const postString = localStorage.getItem(CREATE_STORAGE_POST) as string;
      const savedPost = JSON.parse(postString) as object;

      expect(savedPost).toStrictEqual(postData);
    });

    it("Expect the provided input post data to be merged with the post saved in localStorage", () => {
      const { content, ...data } = postData;

      localStorage.setItem(CREATE_STORAGE_POST, JSON.stringify(data));
      saveCreateStoragePost({ content });

      const postString = localStorage.getItem(CREATE_STORAGE_POST) as string;
      const savedPost = JSON.parse(postString) as object;

      expect(savedPost).toStrictEqual(postData);
    });

    it("Expect the provided input post data to overwrite their corresponding fields in the saved post data", () => {
      const data = {
        title: "New Blog Post Title",
        content: "<p>paragraph one</p>",
        tagIds: ["id-4", "id-5"],
      };

      localStorage.setItem(CREATE_STORAGE_POST, JSON.stringify(postData));
      saveCreateStoragePost(data);

      const postString = localStorage.getItem(CREATE_STORAGE_POST) as string;
      const savedPost = JSON.parse(postString) as object;

      expect(savedPost).toStrictEqual({ ...postData, ...data });
    });

    it("Expect the appropriate fields to be removed from the saved post when empty values are passed for those fields in the input post data", () => {
      localStorage.setItem(CREATE_STORAGE_POST, JSON.stringify(postData));
      saveCreateStoragePost({ description: "", content: "", tagIds: [] });

      const { description: _, content: __, tagIds: ___, ...data } = postData;
      const postString = localStorage.getItem(CREATE_STORAGE_POST) as string;
      const savedPost = JSON.parse(postString) as object;

      expect(savedPost).toStrictEqual(data);
    });

    it("Expect a saved post to retain its field values when empty values for those fields are passed in the input post data", () => {
      const obj = { excerpt: undefined, content: undefined, tagIds: undefined };
      localStorage.setItem(CREATE_STORAGE_POST, JSON.stringify(postData));
      saveCreateStoragePost(obj);

      const postString = localStorage.getItem(CREATE_STORAGE_POST) as string;
      const savedPost = JSON.parse(postString) as object;

      expect(savedPost).toStrictEqual(postData);
    });
  });
});

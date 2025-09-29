import type { ApolloCache } from "@apollo/client";
import buildGetPostsMap from ".";

describe("buildGetPostsMap", () => {
  const extract = vi.fn().mockName("client.extract");
  const cache = { extract } as unknown as ApolloCache<unknown>;

  it("Expect a map of valid getPosts fields", () => {
    extract.mockReturnValueOnce({
      ROOT_MUTATION: {},
      ROOT_QUERY: {
        getPostTags: {
          __typename: "PostTags",
          tags: [
            { __ref: "PostTag:id-1" },
            { __ref: "PostTag:id-2" },
            { __ref: "PostTag:id-3" },
          ],
        },
        'getPosts({"size":6,"sort":"date_desc"})': {
          __typename: "GetPostsData",
          pageData: {
            __typename: "GetPostsPageData",
            next: "cursor-1",
            previous: null,
          },
          posts: [
            { __ref: 'Post:{"url":{"slug":"post-slug-1"}}' },
            { __ref: 'Post:{"url":{"slug":"post-slug-2"}}' },
            { __ref: 'Post:{"url":{"slug":"post-slug-3"}}' },
            { __ref: 'Post:{"url":{"slug":"post-slug-4"}}' },
            { __ref: 'Post:{"url":{"slug":"post-slug-5"}}' },
            { __ref: 'Post:{"url":{"slug":"post-slug-6"}}' },
          ],
        },
        'getPosts({"after":"cursor-1","size":6,"sort":"date_desc"})': {
          __typename: "GetPostsData",
          pageData: {
            __typename: "GetPostsPageData",
            next: "cursor-2",
            previous: "",
          },
          posts: [
            { __ref: 'Post:{"url":{"slug":"post-slug-7"}}' },
            { __ref: 'Post:{"url":{"slug":"post-slug-8"}}' },
            { __ref: 'Post:{"url":{"slug":"post-slug-9"}}' },
            { __ref: 'Post:{"url":{"slug":"post-slug-10"}}' },
            { __ref: 'Post:{"url":{"slug":"post-slug-11"}}' },
            { __ref: 'Post:{"url":{"slug":"post-slug-12"}}' },
          ],
        },
        'getPosts({"after":"cursor-2","size":6,"sort":"date_desc"})': {
          __typename: "GetPostsData",
          pageData: {
            __typename: "GetPostsPageData",
            next: null,
            previous: "cursor-1",
          },
          posts: [
            { __ref: 'Post:{"url":{"slug":"post-slug-13"}}' },
            { __ref: 'Post:{"url":{"slug":"post-slug-14"}}' },
            { __ref: 'Post:{"url":{"slug":"post-slug-15"}}' },
            { __ref: 'Post:{"url":{"slug":"post-slug-16"}}' },
            { __ref: 'Post:{"url":{"slug":"post-slug-17"}}' },
            { __ref: 'Post:{"url":{"slug":"post-slug-18"}}' },
          ],
        },
      },
    });

    const result = buildGetPostsMap(cache, /^getPosts\((.*?)\)$/);

    expect(result.size).toBe(3);

    expect(result.has('{"size":6,"sort":"date_desc"}')).toBe(true);
    expect(result.get('{"size":6,"sort":"date_desc"}')).toStrictEqual({
      fieldData: {
        __typename: "GetPostsData",
        pageData: {
          __typename: "GetPostsPageData",
          next: "cursor-1",
          previous: null,
        },
        posts: [
          { __ref: 'Post:{"url":{"slug":"post-slug-1"}}' },
          { __ref: 'Post:{"url":{"slug":"post-slug-2"}}' },
          { __ref: 'Post:{"url":{"slug":"post-slug-3"}}' },
          { __ref: 'Post:{"url":{"slug":"post-slug-4"}}' },
          { __ref: 'Post:{"url":{"slug":"post-slug-5"}}' },
          { __ref: 'Post:{"url":{"slug":"post-slug-6"}}' },
        ],
      },
      args: { size: 6, sort: "date_desc" },
    });

    expect(result.has('{"after":"cursor-1","size":6,"sort":"date_desc"}')).toBe(
      true
    );

    expect(
      result.get('{"after":"cursor-1","size":6,"sort":"date_desc"}')
    ).toStrictEqual({
      fieldData: {
        __typename: "GetPostsData",
        pageData: {
          __typename: "GetPostsPageData",
          next: "cursor-2",
          previous: "",
        },
        posts: [
          { __ref: 'Post:{"url":{"slug":"post-slug-7"}}' },
          { __ref: 'Post:{"url":{"slug":"post-slug-8"}}' },
          { __ref: 'Post:{"url":{"slug":"post-slug-9"}}' },
          { __ref: 'Post:{"url":{"slug":"post-slug-10"}}' },
          { __ref: 'Post:{"url":{"slug":"post-slug-11"}}' },
          { __ref: 'Post:{"url":{"slug":"post-slug-12"}}' },
        ],
      },
      args: { after: "cursor-1", size: 6, sort: "date_desc" },
    });

    expect(result.has('{"after":"cursor-2","size":6,"sort":"date_desc"}')).toBe(
      true
    );

    expect(
      result.get('{"after":"cursor-2","size":6,"sort":"date_desc"}')
    ).toStrictEqual({
      fieldData: {
        __typename: "GetPostsData",
        pageData: {
          __typename: "GetPostsPageData",
          next: null,
          previous: "cursor-1",
        },
        posts: [
          { __ref: 'Post:{"url":{"slug":"post-slug-13"}}' },
          { __ref: 'Post:{"url":{"slug":"post-slug-14"}}' },
          { __ref: 'Post:{"url":{"slug":"post-slug-15"}}' },
          { __ref: 'Post:{"url":{"slug":"post-slug-16"}}' },
          { __ref: 'Post:{"url":{"slug":"post-slug-17"}}' },
          { __ref: 'Post:{"url":{"slug":"post-slug-18"}}' },
        ],
      },
      args: { after: "cursor-2", size: 6, sort: "date_desc" },
    });
  });

  it("Expect an empty map if no getPosts fields could be parsed", () => {
    extract.mockReturnValueOnce({
      ROOT_MUTATION: {},
      ROOT_QUERY: {
        getPostTags: {
          __typename: "PostTags",
          tags: [
            { __ref: "PostTag:id-1" },
            { __ref: "PostTag:id-2" },
            { __ref: "PostTag:id-3" },
          ],
        },
      },
    });

    const result = buildGetPostsMap(cache, /^getPosts\((.*?)\)$/);

    expect(result.size).toBe(0);
  });
});

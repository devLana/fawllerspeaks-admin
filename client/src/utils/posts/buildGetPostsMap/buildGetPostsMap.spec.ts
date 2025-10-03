import type { ApolloCache } from "@apollo/client";

import buildGetPostsMap from ".";
import { getPostsFieldsRegex } from "../regex/getPostsFieldsRegex";
import { editPostRegex } from "../regex/editPostRegex";
import { unpublishPostRegex } from "../regex/unpublishPostRegex";

describe("buildGetPostsMap", () => {
  const extract = vi.fn().mockName("client.extract");
  const cache = { extract } as unknown as ApolloCache<unknown>;

  describe("Extract getPosts fields", () => {
    extract.mockReturnValue({
      ROOT_MUTATION: {},
      ROOT_QUERY: {
        getPostTags: {
          __typename: "PostTags",
          tags: [{ __ref: "PostTag:id-1" }],
        },
        'getPosts({"size":6,"sort":"date_desc"})': {
          __typename: "GetPostsData",
          pageData: {
            __typename: "GetPostsPageData",
            next: "cursor-1",
            previous: null,
          },
          posts: [
            { __ref: "Post:post-slug-1" },
            { __ref: "Post:post-slug-2" },
            { __ref: "Post:post-slug-3" },
            { __ref: "Post:post-slug-4" },
            { __ref: "Post:post-slug-5" },
            { __ref: "Post:post-slug-6" },
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
            { __ref: "Post:post-slug-7" },
            { __ref: "Post:post-slug-8" },
            { __ref: "Post:post-slug-9" },
            { __ref: "Post:post-slug-10" },
            { __ref: "Post:post-slug-11" },
            { __ref: "Post:post-slug-12" },
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
            { __ref: "Post:post-slug-13" },
            { __ref: "Post:post-slug-14" },
            { __ref: "Post:post-slug-15" },
            { __ref: "Post:post-slug-16" },
            { __ref: "Post:post-slug-17" },
            { __ref: "Post:post-slug-18" },
          ],
        },
        'getPosts({"size":6,"sort":"date_desc","status":"Draft"})': {
          __typename: "GetPostsData",
          pageData: {
            __typename: "GetPostsPageData",
            next: null,
            previous: null,
          },
          posts: [
            { __ref: "Post:post-slug-3" },
            { __ref: "Post:post-slug-5" },
            { __ref: "Post:post-slug-7" },
            { __ref: "Post:post-slug-10" },
            { __ref: "Post:post-slug-15" },
          ],
        },
        'getPosts({"size":6,"sort":"date_desc","status":"Published"})': {
          __typename: "GetPostsData",
          pageData: {
            __typename: "GetPostsPageData",
            next: "cursor-1",
            previous: null,
          },
          posts: [
            { __ref: "Post:post-slug-1" },
            { __ref: "Post:post-slug-2" },
            { __ref: "Post:post-slug-6" },
            { __ref: "Post:post-slug-9" },
            { __ref: "Post:post-slug-11" },
            { __ref: "Post:post-slug-12" },
          ],
        },
        'getPosts({"after":"cursor-1","size":6,"sort":"date_desc","status":"Published"})':
          {
            __typename: "GetPostsData",
            pageData: {
              __typename: "GetPostsPageData",
              next: null,
              previous: "",
            },
            posts: [
              { __ref: "Post:post-slug-13" },
              { __ref: "Post:post-slug-14" },
              { __ref: "Post:post-slug-16" },
              { __ref: "Post:post-slug-17" },
            ],
          },
        'getPosts({"size":6,"sort":"date_desc","status":"Unpublished"})': {
          __typename: "GetPostsData",
          pageData: {
            __typename: "GetPostsPageData",
            next: null,
            previous: null,
          },
          posts: [
            { __ref: "Post:post-slug-4" },
            { __ref: "Post:post-slug-8" },
            { __ref: "Post:post-slug-18" },
          ],
        },
      },
    });

    it("Expect a map of all valid getPosts fields in the cache to be extracted", () => {
      const result = buildGetPostsMap(cache, /^getPosts\((.*?)\)$/);

      expect(result.size).toBe(7);

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
            { __ref: "Post:post-slug-1" },
            { __ref: "Post:post-slug-2" },
            { __ref: "Post:post-slug-3" },
            { __ref: "Post:post-slug-4" },
            { __ref: "Post:post-slug-5" },
            { __ref: "Post:post-slug-6" },
          ],
        },
        args: { size: 6, sort: "date_desc" },
      });

      expect(
        result.has('{"after":"cursor-1","size":6,"sort":"date_desc"}')
      ).toBe(true);

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
            { __ref: "Post:post-slug-7" },
            { __ref: "Post:post-slug-8" },
            { __ref: "Post:post-slug-9" },
            { __ref: "Post:post-slug-10" },
            { __ref: "Post:post-slug-11" },
            { __ref: "Post:post-slug-12" },
          ],
        },
        args: { after: "cursor-1", size: 6, sort: "date_desc" },
      });

      expect(
        result.has('{"after":"cursor-2","size":6,"sort":"date_desc"}')
      ).toBe(true);

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
            { __ref: "Post:post-slug-13" },
            { __ref: "Post:post-slug-14" },
            { __ref: "Post:post-slug-15" },
            { __ref: "Post:post-slug-16" },
            { __ref: "Post:post-slug-17" },
            { __ref: "Post:post-slug-18" },
          ],
        },
        args: { after: "cursor-2", size: 6, sort: "date_desc" },
      });

      expect(result.has('{"size":6,"sort":"date_desc","status":"Draft"}')).toBe(
        true
      );

      expect(
        result.get('{"size":6,"sort":"date_desc","status":"Draft"}')
      ).toStrictEqual({
        fieldData: {
          __typename: "GetPostsData",
          pageData: {
            __typename: "GetPostsPageData",
            next: null,
            previous: null,
          },
          posts: [
            { __ref: "Post:post-slug-3" },
            { __ref: "Post:post-slug-5" },
            { __ref: "Post:post-slug-7" },
            { __ref: "Post:post-slug-10" },
            { __ref: "Post:post-slug-15" },
          ],
        },
        args: { size: 6, sort: "date_desc", status: "Draft" },
      });

      expect(
        result.has('{"size":6,"sort":"date_desc","status":"Published"}')
      ).toBe(true);

      expect(
        result.get('{"size":6,"sort":"date_desc","status":"Published"}')
      ).toStrictEqual({
        fieldData: {
          __typename: "GetPostsData",
          pageData: {
            __typename: "GetPostsPageData",
            next: "cursor-1",
            previous: null,
          },
          posts: [
            { __ref: "Post:post-slug-1" },
            { __ref: "Post:post-slug-2" },
            { __ref: "Post:post-slug-6" },
            { __ref: "Post:post-slug-9" },
            { __ref: "Post:post-slug-11" },
            { __ref: "Post:post-slug-12" },
          ],
        },
        args: { size: 6, sort: "date_desc", status: "Published" },
      });

      expect(
        result.has(
          '{"after":"cursor-1","size":6,"sort":"date_desc","status":"Published"}'
        )
      ).toBe(true);

      expect(
        result.get(
          '{"after":"cursor-1","size":6,"sort":"date_desc","status":"Published"}'
        )
      ).toStrictEqual({
        fieldData: {
          __typename: "GetPostsData",
          pageData: {
            __typename: "GetPostsPageData",
            next: null,
            previous: "",
          },
          posts: [
            { __ref: "Post:post-slug-13" },
            { __ref: "Post:post-slug-14" },
            { __ref: "Post:post-slug-16" },
            { __ref: "Post:post-slug-17" },
          ],
        },
        args: {
          after: "cursor-1",
          size: 6,
          sort: "date_desc",
          status: "Published",
        },
      });

      expect(
        result.has('{"size":6,"sort":"date_desc","status":"Unpublished"}')
      ).toBe(true);

      expect(
        result.get('{"size":6,"sort":"date_desc","status":"Unpublished"}')
      ).toStrictEqual({
        fieldData: {
          __typename: "GetPostsData",
          pageData: {
            __typename: "GetPostsPageData",
            next: null,
            previous: null,
          },
          posts: [
            { __ref: "Post:post-slug-4" },
            { __ref: "Post:post-slug-8" },
            { __ref: "Post:post-slug-18" },
          ],
        },
        args: { size: 6, sort: "date_desc", status: "Unpublished" },
      });
    });

    it("Expect a map of extracted getPosts fields using 'editPostRegex'", () => {
      const regex = editPostRegex("Draft", "Published");
      const result = buildGetPostsMap(cache, regex);

      expect(result.size).toBe(3);

      expect(result.has('{"size":6,"sort":"date_desc","status":"Draft"}')).toBe(
        true
      );

      expect(
        result.get('{"size":6,"sort":"date_desc","status":"Draft"}')
      ).toStrictEqual({
        fieldData: {
          __typename: "GetPostsData",
          pageData: {
            __typename: "GetPostsPageData",
            next: null,
            previous: null,
          },
          posts: [
            { __ref: "Post:post-slug-3" },
            { __ref: "Post:post-slug-5" },
            { __ref: "Post:post-slug-7" },
            { __ref: "Post:post-slug-10" },
            { __ref: "Post:post-slug-15" },
          ],
        },
        args: { size: 6, sort: "date_desc", status: "Draft" },
      });

      expect(
        result.has('{"size":6,"sort":"date_desc","status":"Published"}')
      ).toBe(true);

      expect(
        result.get('{"size":6,"sort":"date_desc","status":"Published"}')
      ).toStrictEqual({
        fieldData: {
          __typename: "GetPostsData",
          pageData: {
            __typename: "GetPostsPageData",
            next: "cursor-1",
            previous: null,
          },
          posts: [
            { __ref: "Post:post-slug-1" },
            { __ref: "Post:post-slug-2" },
            { __ref: "Post:post-slug-6" },
            { __ref: "Post:post-slug-9" },
            { __ref: "Post:post-slug-11" },
            { __ref: "Post:post-slug-12" },
          ],
        },
        args: { size: 6, sort: "date_desc", status: "Published" },
      });

      expect(
        result.has(
          '{"after":"cursor-1","size":6,"sort":"date_desc","status":"Published"}'
        )
      ).toBe(true);

      expect(
        result.get(
          '{"after":"cursor-1","size":6,"sort":"date_desc","status":"Published"}'
        )
      ).toStrictEqual({
        fieldData: {
          __typename: "GetPostsData",
          pageData: {
            __typename: "GetPostsPageData",
            next: null,
            previous: "",
          },
          posts: [
            { __ref: "Post:post-slug-13" },
            { __ref: "Post:post-slug-14" },
            { __ref: "Post:post-slug-16" },
            { __ref: "Post:post-slug-17" },
          ],
        },
        args: {
          after: "cursor-1",
          size: 6,
          sort: "date_desc",
          status: "Published",
        },
      });
    });

    it("Expect a map of extracted getPosts fields using 'unpublishPostRegex'", () => {
      const result = buildGetPostsMap(cache, unpublishPostRegex);

      expect(result.size).toBe(3);

      expect(
        result.has('{"size":6,"sort":"date_desc","status":"Published"}')
      ).toBe(true);

      expect(
        result.get('{"size":6,"sort":"date_desc","status":"Published"}')
      ).toStrictEqual({
        fieldData: {
          __typename: "GetPostsData",
          pageData: {
            __typename: "GetPostsPageData",
            next: "cursor-1",
            previous: null,
          },
          posts: [
            { __ref: "Post:post-slug-1" },
            { __ref: "Post:post-slug-2" },
            { __ref: "Post:post-slug-6" },
            { __ref: "Post:post-slug-9" },
            { __ref: "Post:post-slug-11" },
            { __ref: "Post:post-slug-12" },
          ],
        },
        args: { size: 6, sort: "date_desc", status: "Published" },
      });

      expect(
        result.has(
          '{"after":"cursor-1","size":6,"sort":"date_desc","status":"Published"}'
        )
      ).toBe(true);

      expect(
        result.get(
          '{"after":"cursor-1","size":6,"sort":"date_desc","status":"Published"}'
        )
      ).toStrictEqual({
        fieldData: {
          __typename: "GetPostsData",
          pageData: {
            __typename: "GetPostsPageData",
            next: null,
            previous: "",
          },
          posts: [
            { __ref: "Post:post-slug-13" },
            { __ref: "Post:post-slug-14" },
            { __ref: "Post:post-slug-16" },
            { __ref: "Post:post-slug-17" },
          ],
        },
        args: {
          after: "cursor-1",
          size: 6,
          sort: "date_desc",
          status: "Published",
        },
      });

      expect(
        result.has('{"size":6,"sort":"date_desc","status":"Unpublished"}')
      ).toBe(true);

      expect(
        result.get('{"size":6,"sort":"date_desc","status":"Unpublished"}')
      ).toStrictEqual({
        fieldData: {
          __typename: "GetPostsData",
          pageData: {
            __typename: "GetPostsPageData",
            next: null,
            previous: null,
          },
          posts: [
            { __ref: "Post:post-slug-4" },
            { __ref: "Post:post-slug-8" },
            { __ref: "Post:post-slug-18" },
          ],
        },
        args: { size: 6, sort: "date_desc", status: "Unpublished" },
      });
    });

    it("Expect a map of extracted getPosts fields using 'getPostsFieldsRegex'", () => {
      const result = buildGetPostsMap(cache, getPostsFieldsRegex("Published"));

      expect(result.size).toBe(5);

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
            { __ref: "Post:post-slug-1" },
            { __ref: "Post:post-slug-2" },
            { __ref: "Post:post-slug-3" },
            { __ref: "Post:post-slug-4" },
            { __ref: "Post:post-slug-5" },
            { __ref: "Post:post-slug-6" },
          ],
        },
        args: { size: 6, sort: "date_desc" },
      });

      expect(
        result.has('{"after":"cursor-1","size":6,"sort":"date_desc"}')
      ).toBe(true);

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
            { __ref: "Post:post-slug-7" },
            { __ref: "Post:post-slug-8" },
            { __ref: "Post:post-slug-9" },
            { __ref: "Post:post-slug-10" },
            { __ref: "Post:post-slug-11" },
            { __ref: "Post:post-slug-12" },
          ],
        },
        args: { after: "cursor-1", size: 6, sort: "date_desc" },
      });

      expect(
        result.has('{"after":"cursor-2","size":6,"sort":"date_desc"}')
      ).toBe(true);

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
            { __ref: "Post:post-slug-13" },
            { __ref: "Post:post-slug-14" },
            { __ref: "Post:post-slug-15" },
            { __ref: "Post:post-slug-16" },
            { __ref: "Post:post-slug-17" },
            { __ref: "Post:post-slug-18" },
          ],
        },
        args: { after: "cursor-2", size: 6, sort: "date_desc" },
      });

      expect(
        result.has('{"size":6,"sort":"date_desc","status":"Published"}')
      ).toBe(true);

      expect(
        result.get('{"size":6,"sort":"date_desc","status":"Published"}')
      ).toStrictEqual({
        fieldData: {
          __typename: "GetPostsData",
          pageData: {
            __typename: "GetPostsPageData",
            next: "cursor-1",
            previous: null,
          },
          posts: [
            { __ref: "Post:post-slug-1" },
            { __ref: "Post:post-slug-2" },
            { __ref: "Post:post-slug-6" },
            { __ref: "Post:post-slug-9" },
            { __ref: "Post:post-slug-11" },
            { __ref: "Post:post-slug-12" },
          ],
        },
        args: { size: 6, sort: "date_desc", status: "Published" },
      });

      expect(
        result.has(
          '{"after":"cursor-1","size":6,"sort":"date_desc","status":"Published"}'
        )
      ).toBe(true);

      expect(
        result.get(
          '{"after":"cursor-1","size":6,"sort":"date_desc","status":"Published"}'
        )
      ).toStrictEqual({
        fieldData: {
          __typename: "GetPostsData",
          pageData: {
            __typename: "GetPostsPageData",
            next: null,
            previous: "",
          },
          posts: [
            { __ref: "Post:post-slug-13" },
            { __ref: "Post:post-slug-14" },
            { __ref: "Post:post-slug-16" },
            { __ref: "Post:post-slug-17" },
          ],
        },
        args: {
          after: "cursor-1",
          size: 6,
          sort: "date_desc",
          status: "Published",
        },
      });
    });
  });

  describe("No getsPosts fields should be extracted", () => {
    it("Expect an empty map if no valid getPosts fields could be parsed", () => {
      extract.mockReturnValue({
        ROOT_MUTATION: {},
        ROOT_QUERY: {
          getPostTags: {
            __typename: "PostTags",
            tags: [
              { __ref: "PostTag:id-1" },
              { __ref: "PostTag:id-2" },
              { __ref: "PostTag:id-3" },
              { __ref: "PostTag:id-4" },
              { __ref: "PostTag:id-5" },
            ],
          },
        },
      });

      const regex = editPostRegex("Published", "Unpublished");
      const result1 = buildGetPostsMap(cache, /^getPosts\((.*?)\)$/);
      const result2 = buildGetPostsMap(cache, unpublishPostRegex);
      const result3 = buildGetPostsMap(cache, getPostsFieldsRegex("Draft"));
      const result4 = buildGetPostsMap(cache, regex);

      expect(result1.size).toBe(0);
      expect(result2.size).toBe(0);
      expect(result3.size).toBe(0);
      expect(result4.size).toBe(0);
    });
  });
});

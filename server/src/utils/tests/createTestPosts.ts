import type { Pool } from "pg";

import { getPostUrl, mapPostTags } from "@features/posts/utils";

import type { DbFindPost, TestPosts, PostAuthor } from "@types";
import type { Post, PostTag } from "@resolverTypes";

interface Params {
  db: Pool;
  postTags: PostTag[];
  author: PostAuthor;
  posts: TestPosts;
}

const createTestPosts = async (params: Params): Promise<Post[]> => {
  const { db, postTags, author, posts } = params;

  const map = new Map<string, PostTag>();

  const tags = postTags.map(postTag => {
    map.set(postTag.id, postTag);
    return postTag.id;
  });

  try {
    const { rows: createPost } = await db.query<DbFindPost>(
      `INSERT INTO posts (
        title,
        description,
        content,
        author,
        status,
        slug,
        image_banner,
        date_created,
        date_published,
        last_modified,
        is_in_bin,
        is_deleted,
        tags
      ) VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13),
        ($14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
      RETURNING
        post_id "postId",
        title,
        description,
        content,
        author,
        status,
        slug,
        image_banner "imageBanner",
        date_created "dateCreated",
        date_published "datePublished",
        last_modified "lastModified",
        views,
        likes,
        is_in_bin "isInBin",
        is_deleted "isDeleted",
        tags`,
      [
        posts.first.title,
        posts.first.description,
        posts.first.content,
        author.userId,
        posts.first.status,
        posts.first.slug,
        posts.first.imageBanner,
        Date.now(),
        posts.first.datePublished,
        posts.first.lastModified,
        posts.first.isInBin,
        posts.first.isDeleted,
        tags,

        posts.second.title,
        posts.second.description,
        posts.second.content,
        author.userId,
        posts.second.status,
        null,
        posts.second.imageBanner,
        Date.now(),
        posts.second.datePublished,
        posts.second.lastModified,
        posts.second.isInBin,
        posts.second.isDeleted,
        null,
      ]
    );

    return createPost.map(post => {
      const postUrl = getPostUrl(post.slug ?? post.title);
      const mappedTags = post.tags ? mapPostTags(post.tags, map) : null;

      const datePublished = post.datePublished
        ? Number(post.datePublished)
        : post.datePublished;

      const lastModified = post.lastModified
        ? Number(post.lastModified)
        : post.lastModified;

      return {
        __typename: "Post",
        id: post.postId,
        title: post.title,
        description: post.description,
        content: post.content,
        author: `${author.firstName} ${author.lastName}`,
        status: post.status,
        url: postUrl,
        slug: post.slug,
        imageBanner: post.imageBanner,
        dateCreated: Number(post.dateCreated),
        datePublished,
        lastModified,
        views: post.views,
        likes: post.likes,
        isInBin: post.isInBin,
        isDeleted: post.isDeleted,
        tags: mappedTags,
      };
    });
  } catch (err) {
    console.error("Create Test Posts Error - ", err);
    throw new Error("Unable to create test posts");
  }
};

export default createTestPosts;

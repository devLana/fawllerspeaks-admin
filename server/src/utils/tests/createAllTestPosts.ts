import type { Pool } from "pg";

import { getPostUrl, mapPostTags } from "@features/posts/utils";

import {
  unpublishedTestPosts,
  publishedTestPosts,
  draftTestPosts,
} from "./mocks";
import { DATE_COLUMN_MULTIPLIER } from "../constants";

import { type PostTag, type Post, PostStatus } from "@resolverTypes";
import type { DbFindPost, PostAuthor } from "@types";

const createAllTestPosts = async (
  db: Pool,
  postTags: PostTag[],
  author: PostAuthor
) => {
  const map = new Map<string, PostTag>();

  const tags = postTags.map(postTag => {
    map.set(postTag.id, postTag);
    return postTag.id;
  });

  try {
    const { rows } = await db.query<DbFindPost>(
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
        ($14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26),
        ($27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39),
        ($40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52),
        ($53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65),
        ($66, $67, $68, $69, $70, $71, $72, $73, $74, $75,$76, $77, $78)
      RETURNING
        post_id "postId",
        title,
        description,
        content,
        author,
        status,
        slug,
        image_banner "imageBanner",
        date_created * ${DATE_COLUMN_MULTIPLIER} "dateCreated",
        date_published * ${DATE_COLUMN_MULTIPLIER} "datePublished",
        last_modified * ${DATE_COLUMN_MULTIPLIER} "lastModified",
        views,
        likes,
        is_in_bin "isInBin",
        is_deleted "isDeleted",
        tags`,
      [
        unpublishedTestPosts.first.title,
        unpublishedTestPosts.first.description,
        unpublishedTestPosts.first.content,
        author.userId,
        unpublishedTestPosts.first.status,
        unpublishedTestPosts.first.slug,
        null,
        Date.now() / DATE_COLUMN_MULTIPLIER,
        null,
        null,
        false,
        false,
        tags,

        unpublishedTestPosts.second.title,
        unpublishedTestPosts.second.description,
        unpublishedTestPosts.second.content,
        author.userId,
        unpublishedTestPosts.second.status,
        null,
        null,
        Date.now() / DATE_COLUMN_MULTIPLIER,
        null,
        null,
        false,
        false,
        null,

        publishedTestPosts.first.title,
        publishedTestPosts.first.description,
        publishedTestPosts.first.content,
        author.userId,
        publishedTestPosts.first.status,
        publishedTestPosts.first.slug,
        null,
        Date.now() / DATE_COLUMN_MULTIPLIER,
        Date.now() / DATE_COLUMN_MULTIPLIER,
        null,
        false,
        false,
        tags,

        publishedTestPosts.second.title,
        publishedTestPosts.second.description,
        publishedTestPosts.second.content,
        author.userId,
        publishedTestPosts.second.status,
        null,
        null,
        Date.now() / DATE_COLUMN_MULTIPLIER,
        Date.now() / DATE_COLUMN_MULTIPLIER,
        null,
        false,
        false,
        null,

        draftTestPosts.first.title,
        draftTestPosts.first.description,
        draftTestPosts.first.content,
        author.userId,
        draftTestPosts.first.status,
        draftTestPosts.first.slug,
        null,
        Date.now() / DATE_COLUMN_MULTIPLIER,
        null,
        null,
        false,
        false,
        tags,

        draftTestPosts.second.title,
        draftTestPosts.second.description,
        draftTestPosts.second.content,
        author.userId,
        draftTestPosts.second.status,
        null,
        null,
        Date.now() / DATE_COLUMN_MULTIPLIER,
        null,
        null,
        false,
        false,
        null,
      ]
    );

    const publishedPosts: Post[] = [];
    const draftPosts: Post[] = [];
    const unpublishedPosts: Post[] = [];

    for (const row of rows) {
      const postUrl = getPostUrl(row.slug ?? row.title);
      const mappedTags = !row.tags ? null : mapPostTags(row.tags, map);

      const datePublished = row.datePublished
        ? Number(row.datePublished)
        : row.datePublished;

      const lastModified = row.lastModified
        ? Number(row.lastModified)
        : row.lastModified;

      const post = {
        __typename: "Post",
        id: row.postId,
        title: row.title,
        description: row.description,
        content: row.content,
        author: `${author.firstName} ${author.lastName}`,
        status: row.status,
        url: postUrl,
        slug: row.slug,
        imageBanner: row.imageBanner,
        dateCreated: Number(row.dateCreated),
        datePublished,
        lastModified,
        views: row.views,
        likes: row.likes,
        isInBin: row.isInBin,
        isDeleted: row.isDeleted,
        tags: mappedTags,
      } as const;

      if (post.status === PostStatus.Draft) {
        draftPosts.push(post);
      } else if (post.status === PostStatus.Published) {
        publishedPosts.push(post);
      } else {
        unpublishedPosts.push(post);
      }
    }

    return { draftPosts, publishedPosts, unpublishedPosts };
  } catch (err) {
    console.error("Create All Test Posts Error - ", err);
    throw new Error("Unable to create all test posts");
  }
};

export default createAllTestPosts;

import type { Pool } from "pg";

import { getPostUrl, mapPostTags } from "@features/posts/utils";
import dateToISOString from "../dateToISOString";

import type { GetPostDBData, TestPostAuthor, TestPostData } from "@types";
import type { Post, PostTag } from "@resolverTypes";

interface Params {
  db: Pool;
  postTags?: PostTag[];
  postAuthor: TestPostAuthor;
  postData: TestPostData;
}

const createTestPost = async (params: Params): Promise<Post> => {
  const { db, postTags, postAuthor, postData } = params;
  const map = new Map<string, PostTag>();

  const tags = postTags?.map(postTag => {
    map.set(postTag.id, postTag);
    return postTag.id;
  });

  try {
    const { rows } = await db.query<GetPostDBData>(
      `INSERT INTO posts (
        title,
        description,
        content,
        author,
        status,
        image_banner,
        date_published,
        last_modified,
        is_in_bin,
        is_deleted
      ) VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING
        id,
        post_id "postId",
        title,
        description,
        content,
        author,
        status,
        image_banner "imageBanner",
        date_created "dateCreated",
        date_published "datePublished",
        last_modified "lastModified",
        views,
        is_in_bin "isInBin",
        is_deleted "isDeleted"`,
      [
        postData.title,
        postData.description,
        postData.content,
        postAuthor.userId,
        postData.status,
        postData.imageBanner,
        postData.datePublished,
        postData.lastModified,
        postData.isInBin,
        postData.isDeleted,
      ]
    );

    const [post] = rows;

    if (tags) {
      void db.query(
        `UPDATE post_tags
        SET posts = array_append(posts, $1)
        WHERE tag_id = ANY ($2)`,
        [post.id, tags]
      );
    }

    const { url, slug } = getPostUrl(post.title);
    const mappedTags = tags ? mapPostTags(tags, map) : null;

    const author = {
      name: `${postAuthor.firstName} ${postAuthor.lastName}`,
      image: postAuthor.image,
    };

    const datePublished = post.datePublished
      ? dateToISOString(post.datePublished)
      : post.datePublished;

    const lastModified = post.lastModified
      ? dateToISOString(post.lastModified)
      : post.lastModified;

    return {
      __typename: "Post",
      id: post.postId,
      title: post.title,
      description: post.description,
      content: post.content,
      author,
      status: post.status,
      url,
      slug,
      imageBanner: post.imageBanner,
      dateCreated: dateToISOString(post.dateCreated),
      datePublished,
      lastModified,
      views: post.views,
      isInBin: post.isInBin,
      isDeleted: post.isDeleted,
      tags: mappedTags,
    };
  } catch (err) {
    console.error("Create Test Post Error - ", err);
    throw new Error("Unable to create test post");
  }
};

export default createTestPost;

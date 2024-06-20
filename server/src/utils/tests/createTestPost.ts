import type { Pool } from "pg";

import supabase from "@lib/supabase/supabaseClient";
import { getPostContentResponse } from "@features/posts/utils/getPostContentResponse";
import getPostUrl from "@features/posts/utils/getPostUrl";
import dateToISOString from "@utils/dateToISOString";

import type { GetPostDBData, TestPostAuthor, TestPostData } from "@types";
import type { Post, PostAuthor, PostTag } from "@resolverTypes";

interface Params {
  db: Pool;
  postTags?: PostTag[];
  postAuthor: TestPostAuthor;
  postData: TestPostData;
}

const createTestPost = async (params: Params): Promise<Post> => {
  const { db, postTags, postAuthor, postData } = params;
  const tagIds = postTags?.map(postTag => postTag.id);

  try {
    const { rows } = await db.query<GetPostDBData>(
      `INSERT INTO posts (
        title,
        slug,
        description,
        excerpt,
        content,
        author,
        status,
        image_banner,
        date_published,
        last_modified,
        is_in_bin,
        is_deleted
      ) VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING
        id,
        post_id "postId",
        title,
        description,
        excerpt,
        content,
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
        postData.slug,
        postData.description,
        postData.excerpt,
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

    if (tagIds) {
      void db.query(
        `UPDATE post_tags
        SET posts = array_append(posts, $1)
        WHERE tag_id = ANY ($2)`,
        [post.id, tagIds]
      );
    }

    const { storageUrl } = supabase();

    const author: PostAuthor = {
      __typename: "PostAuthor",
      name: `${postAuthor.firstName} ${postAuthor.lastName}`,
      image: postAuthor.image ? `${storageUrl}${postAuthor.image}` : null,
    };

    const datePublished = post.datePublished
      ? dateToISOString(post.datePublished)
      : post.datePublished;

    const lastModified = post.lastModified
      ? dateToISOString(post.lastModified)
      : post.lastModified;

    const { slug, href } = getPostUrl(post.title);

    return {
      __typename: "Post",
      id: post.postId,
      title: post.title,
      description: post.description,
      excerpt: post.excerpt,
      content: post.content ? getPostContentResponse(post.content) : null,
      author,
      status: post.status,
      url: { __typename: "PostUrl", slug, href },
      imageBanner: post.imageBanner ? `${storageUrl}${post.imageBanner}` : null,
      dateCreated: dateToISOString(post.dateCreated),
      datePublished,
      lastModified,
      views: post.views,
      isInBin: post.isInBin,
      isDeleted: post.isDeleted,
      tags: postTags ?? null,
    };
  } catch (err) {
    console.error("Create Test Post Error - ", err);
    throw new Error("Unable to create test post");
  }
};

export default createTestPost;

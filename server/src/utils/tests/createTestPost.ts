import type { Pool } from "pg";

import supabase from "@lib/supabase/supabaseClient";
import { getPostContentResponse } from "@features/posts/utils/getPostContentResponse";
import getPostSlug from "@features/posts/utils/getPostSlug";
import { urls } from "@utils/ClientUrls";
import dateToISOString from "@utils/dateToISOString";

import type { GetPostDBData, TestPostAuthor, TestPostData } from "@types";
import type {
  Post,
  PostContent,
  PostTableOfContents,
  PostTag,
} from "@resolverTypes";

interface Options {
  db: Pool;
  postTags?: PostTag[];
  postAuthor: TestPostAuthor;
  postData: TestPostData;
}

type OmitKeys = "author" | "url" | "tags" | "postId";

const createTestPost = async (params: Options): Promise<Post> => {
  const { db, postTags, postAuthor, postData } = params;
  const tagIds = postTags?.map(postTag => postTag.id);
  const dbTags = tagIds ? `{${tagIds.join(",")}}` : null;

  try {
    const { rows } = await db.query<Omit<GetPostDBData, OmitKeys>>(
      `WITH post_tag_ids AS (
        SELECT NULLIF(
          ARRAY(
            SELECT id
            FROM post_tags
            WHERE tag_id = ANY ($13::uuid[])
          ),
          ARRAY[]::smallint[]
        ) AS tag_ids
      )
      INSERT INTO posts (
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
        is_deleted,
        tags
      ) VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, (SELECT tag_ids FROM post_tag_ids))
      RETURNING
        post_id id,
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
        is_deleted "isDeleted";`,
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
        dbTags,
      ]
    );

    const [post] = rows;
    const { storageUrl } = supabase();
    const slug = getPostSlug(post.title);
    let content: PostContent | null = null;

    const datePublished = post.datePublished
      ? dateToISOString(post.datePublished)
      : post.datePublished;

    const lastModified = post.lastModified
      ? dateToISOString(post.lastModified)
      : post.lastModified;

    if (post.content) {
      const { html, tableOfContents } = getPostContentResponse(post.content);
      let toc: PostTableOfContents[] | null = null;

      if (tableOfContents) {
        toc = tableOfContents.map(item => ({
          __typename: "PostTableOfContents",
          ...item,
        }));
      }

      content = {
        __typename: "PostContent",
        html,
        tableOfContents: toc,
      };
    }

    return {
      __typename: "Post",
      id: post.id,
      title: post.title,
      description: post.description,
      excerpt: post.excerpt,
      content,
      author: {
        __typename: "PostAuthor",
        name: `${postAuthor.firstName} ${postAuthor.lastName}`,
        image: postAuthor.image ? `${storageUrl}${postAuthor.image}` : null,
      },
      status: post.status,
      url: {
        __typename: "PostUrl",
        slug,
        href: `${urls.siteUrl}/blog/${slug}`,
      },
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

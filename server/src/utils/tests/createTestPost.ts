import type { Pool } from "pg";

import supabase from "@lib/supabase/supabaseClient";
import { getPostContentResponse } from "@features/posts/utils/getPostContentResponse";
import { urls } from "@utils/ClientUrls";
import dateToISOString from "@utils/dateToISOString";

import type {
  Post,
  PostContent,
  PostTableOfContents,
  PostTag,
} from "@resolverTypes";
import type { PostDBData, TestPostAuthor, TestPostData } from "@types";

interface Options {
  db: Pool;
  postTags?: PostTag[];
  postAuthor: TestPostAuthor;
  postData: TestPostData;
}

const createTestPost = async (params: Options): Promise<Post> => {
  const { db, postTags, postAuthor, postData } = params;
  const tagIds = postTags?.map(postTag => postTag.id);
  const dbTags = tagIds ? `{${tagIds.join(",")}}` : null;

  try {
    const { rows } = await db.query<PostDBData>(
      `WITH create_post AS (
        INSERT INTO posts (
          title,
          slug,
          description,
          excerpt,
          author,
          status,
          image_banner,
          date_published,
          last_modified,
          is_in_bin,
          is_deleted
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      ),
      resolved_tags AS (
        SELECT id, tag_id, name, date_created, last_modified
        FROM post_tags
        WHERE tag_id = ANY ($12::uuid[])
      ),
      insert_tags AS (
        INSERT INTO post_tags_to_posts (post_id, tag_id)
        SELECT cp.id, rt.id
        FROM create_post cp CROSS JOIN resolved_tags rt
      ),
      insert_content AS (
        INSERT INTO post_contents (post_id, content)
        SELECT id, $13::text
        FROM create_post
        WHERE $13::text IS NOT NULL
      )
      SELECT
        cp.post_id id,
        cp.slug,
        cp.title,
        cp.description,
        cp.excerpt,
        $13::text content,
        cp.status,
        cp.image_banner "imageBanner",
        cp.date_created "dateCreated",
        cp.date_published "datePublished",
        cp.last_modified "lastModified",
        cp.views,
        cp.is_in_bin "isBinned",
        cp.binned_at "binnedAt",
        json_agg(
          json_build_object(
            'id', rt.tag_id,
            'name', rt.name,
            'dateCreated', rt.date_created,
            'lastModified', rt.last_modified
          )
        ) FILTER (WHERE rt.id IS NOT NULL) tags
      FROM create_post cp
      LEFT JOIN resolved_tags rt ON TRUE
      GROUP BY
        cp.post_id,
        cp.slug,
        cp.title,
        cp.description,
        cp.excerpt,
        cp.status,
        cp.image_banner,
        cp.date_created,
        cp.date_published,
        cp.last_modified,
        cp.views,
        cp.is_in_bin,
        cp.binned_at,
        $13::text`,
      [
        postData.title,
        postData.slug,
        postData.description,
        postData.excerpt,
        postAuthor.userId,
        postData.status,
        postData.imageBanner,
        postData.datePublished,
        postData.lastModified,
        postData.isInBin,
        postData.isDeleted,
        dbTags,
        postData.content,
      ]
    );

    const [post] = rows;
    const { storageUrl } = supabase();
    let content: PostContent | null = null;

    const datePublished = post.datePublished
      ? dateToISOString(post.datePublished)
      : post.datePublished;

    const lastModified = post.lastModified
      ? dateToISOString(post.lastModified)
      : post.lastModified;

    const binnedAt = post.binnedAt
      ? dateToISOString(post.binnedAt)
      : post.binnedAt;

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
        slug: post.slug,
        href: `${urls.siteUrl}/blog/${post.slug}`,
      },
      imageBanner: post.imageBanner ? `${storageUrl}${post.imageBanner}` : null,
      dateCreated: dateToISOString(post.dateCreated),
      datePublished,
      lastModified,
      views: post.views,
      isBinned: post.isBinned,
      binnedAt,
      tags: postTags ?? null,
    };
  } catch (err) {
    console.error("Create Test Post Error - ", err);
    throw new Error("Unable to create test post");
  }
};

export default createTestPost;

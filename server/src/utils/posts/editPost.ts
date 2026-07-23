import type { Pool } from "pg";

import type { PostTag } from "@appTypes/resolverTypes";
import type { EditPostCTE } from "@appTypes/posts/editPost";

export const findRows = async (
  db: Pool,
  user: string,
  postId: string,
): Promise<EditPostCTE[]> => {
  const { rows } = await db.query<EditPostCTE>(
    `WITH find_user AS (
      SELECT
        is_registered,
        first_name||' '||last_name "userName",
        image "userImage"
      FROM users
      WHERE user_id = $1
    ),
    find_post_by_id AS (
      SELECT id, status, image_banner, binned_at
      FROM posts
      WHERE post_id = $2
    )
    SELECT *
    FROM find_user
    LEFT JOIN find_post_by_id ON true`,
    [user, postId],
  );

  return rows;
};

export const editTags = async (
  db: Pool,
  tagIds: readonly string[] | null,
  postId: number,
): Promise<PostTag[] | null> => {
  if (tagIds === null) {
    await db.query(`DELETE FROM post_tags_to_posts WHERE post_id = $1`, [
      postId,
    ]);

    return null;
  }

  const dbTags = `{${tagIds.join(",")}}`;

  const { rows: editedTags } = await db.query<PostTag>(
    `WITH resolved_tags AS (
      SELECT id, tag_id, name, date_created, last_modified
      FROM post_tags
      WHERE tag_id = ANY ($1::uuid[])
    ),
    current_post_tags AS (
      SELECT post_id, tag_id
      FROM post_tags_to_posts
      WHERE post_id = $2
    ),
    tags_to_insert AS (
      SELECT rt.id
      FROM resolved_tags rt
      LEFT JOIN current_post_tags cpt ON rt.id = cpt.tag_id
      WHERE cpt.tag_id IS NULL
    ),
    insert_tags AS (
      INSERT INTO post_tags_to_posts (post_id, tag_id)
      SELECT $2::int AS post_id, id AS tag_id FROM tags_to_insert
      ON CONFLICT (post_id, tag_id) DO NOTHING
    ),
    tags_to_delete AS (
      SELECT cpt.tag_id
      FROM resolved_tags rt
      RIGHT JOIN current_post_tags cpt ON cpt.tag_id = rt.id
      WHERE rt.id IS NULL
    ),
    delete_tags AS (
      DELETE FROM post_tags_to_posts
      WHERE post_id = $2
      AND tag_id IN (SELECT tag_id FROM tags_to_delete)
    )
    SELECT
      tag_id id,
      name,
      date_created "dateCreated",
      last_modified "lastModified"
    FROM resolved_tags`,
    [dbTags, postId],
  );

  if (editedTags.length > 0) return editedTags;

  return null;
};

export const editContent = async (
  db: Pool,
  content: string | null,
  postId: number,
): Promise<string | null> => {
  if (content === null) {
    await db.query(`DELETE FROM post_contents WHERE post_id = $1`, [postId]);
    return null;
  }

  const { rows: upsertContent } = await db.query<{ content: string }>(
    `INSERT INTO post_contents (post_id, content)
    VALUES ($1, $2)
    ON CONFLICT (post_id)
    DO UPDATE SET content = EXCLUDED.content
    RETURNING content`,
    [postId, content],
  );

  if (upsertContent.length > 0) return upsertContent[0].content;

  return null;
};

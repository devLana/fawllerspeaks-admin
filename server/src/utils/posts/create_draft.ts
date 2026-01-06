import type { Pool } from "pg";
import type { PostTag } from "@resolverTypes";

interface CreateDraftUser {
  id: number;
  is_registered: boolean;
  authorName: string;
  image: string | null;
  slug: number | null;
}

export const findRows = async (
  db: Pool,
  user: string,
  slug: string
): Promise<CreateDraftUser[]> => {
  const { rows } = await db.query<CreateDraftUser>(
    `WITH find_user AS (
      SELECT
        id,
        is_registered,
        concat(first_name,' ',last_name) "authorName",
        image
      FROM users
      WHERE user_id = $1
    ),
    find_post AS (
      SELECT 1 AS slug FROM posts WHERE slug = $2
    )
    SELECT *
    FROM find_user
    LEFT JOIN find_post ON true`,
    [user, slug]
  );

  return rows;
};

export const resolvePostTags = async (
  db: Pool,
  postId: number,
  tagIds: readonly string[]
): Promise<PostTag[] | null> => {
  const dbTags = `{${tagIds.join(",")}}`;

  const { rows: insertedTags } = await db.query<PostTag>(
    `WITH resolved_tags AS (
      SELECT id, tag_id, name, date_created, last_modified
      FROM post_tags
      WHERE tag_id = ANY ($1::uuid[])
    ),
    insert_tags AS (
      INSERT INTO post_tags_to_posts (tag_id, post_id)
      SELECT id AS tag_id, $2::int AS post_id FROM resolved_tags
      ON CONFLICT (tag_id, post_id) DO NOTHING
      RETURNING tag_id, post_id
    )
    SELECT
      tag_id id,
      name,
      date_created "dateCreated",
      last_modified "lastModified"
    FROM resolved_tags`,
    [dbTags, postId]
  );

  if (insertedTags.length > 0) return insertedTags;

  return null;
};

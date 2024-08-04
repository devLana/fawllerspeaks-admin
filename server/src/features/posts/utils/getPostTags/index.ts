import type { Pool } from "pg";
import type { PostTag } from "@resolverTypes";

const getPostTags = async (db: Pool, tags: readonly number[]) => {
  const { rows } = await db.query<PostTag>(
    `SELECT
      tag_id id,
      id "tagId",
      name,
      date_created "dateCreated",
      last_modified "lastModified"
    FROM post_tags
    WHERE id = ANY ($1)`,
    [tags]
  );

  return rows.length === 0 ? null : rows;
};

export default getPostTags;

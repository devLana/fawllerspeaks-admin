import type { Pool } from "pg";

import { DATE_COLUMN_MULTIPLIER } from "@utils";
import type { PostTag } from "@resolverTypes";

const getPostTags = async (db: Pool, tags: string[]) => {
  const { rows } = await db.query<PostTag>(
    `SELECT
      tag_id id,
      name,
      date_created * ${DATE_COLUMN_MULTIPLIER} "dateCreated",
      last_modified * ${DATE_COLUMN_MULTIPLIER} "lastModified"
    FROM
      post_tags
    WHERE
      tag_id = ANY ($1)`,
    [tags]
  );

  return rows.length === 0 ? null : rows;
};

export default getPostTags;

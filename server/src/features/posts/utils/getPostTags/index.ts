import type { Pool } from "pg";

import { dateToISOString } from "@utils";
import type { PostTag } from "@resolverTypes";

const getPostTags = async (db: Pool, tags: readonly string[]) => {
  let { rows } = await db.query<PostTag>(
    `SELECT
      tag_id id,
      name,
      date_created "dateCreated",
      last_modified "lastModified"
    FROM post_tags
    WHERE tag_id = ANY ($1)`,
    [tags]
  );

  rows = rows.map(row => ({
    ...row,
    dateCreated: dateToISOString(row.dateCreated),
    lastModified: row.lastModified
      ? dateToISOString(row.lastModified)
      : row.lastModified,
  }));

  return rows.length === 0 ? null : rows;
};

export default getPostTags;

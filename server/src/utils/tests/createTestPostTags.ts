import type { Pool } from "pg";

import { DATE_COLUMN_MULTIPLIER } from "../constants";
import type { PostTag } from "@resolverTypes";

const createTestPostTags = async (db: Pool): Promise<PostTag[]> => {
  try {
    const { rows } = await db.query<PostTag>(
      `INSERT INTO
        post_tags (name, date_created)
      VALUES
        ($1, $2), ($3, $4), ($5, $6), ($7, $8), ($9, $10)
      RETURNING
        tag_id id,
        name,
        date_created * ${DATE_COLUMN_MULTIPLIER} "dateCreated",
        last_Modified * ${DATE_COLUMN_MULTIPLIER} "lastModified"`,
      [
        "tag10",
        Date.now() / DATE_COLUMN_MULTIPLIER,
        "tag11",
        Date.now() / DATE_COLUMN_MULTIPLIER,
        "tag12",
        Date.now() / DATE_COLUMN_MULTIPLIER,
        "tag13",
        Date.now() / DATE_COLUMN_MULTIPLIER,
        "tag14",
        Date.now() / DATE_COLUMN_MULTIPLIER,
      ]
    );

    return rows.map(row => ({
      __typename: "PostTag",
      ...row,
      dateCreated: row.dateCreated ? Number(row.dateCreated) : row.dateCreated,
      lastModified: row.lastModified
        ? Number(row.lastModified)
        : row.lastModified,
    }));
  } catch (err) {
    console.log("Create Test Post Tags Error - ", err);
    throw new Error("Unable to create test post tags");
  }
};

export default createTestPostTags;

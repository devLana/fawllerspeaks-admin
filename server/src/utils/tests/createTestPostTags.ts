import type { Pool } from "pg";

import type { PostTag } from "@resolverTypes";
import dateToISOString from "@utils/dateToISOString";

const createTestPostTags = async (db: Pool): Promise<PostTag[]> => {
  try {
    const { rows } = await db.query<PostTag>(
      `INSERT INTO
        post_tags (name)
      VALUES
        ($1), ($2), ($3), ($4), ($5)
      RETURNING
        tag_id id,
        id "tagId",
        name,
        date_created "dateCreated",
        last_Modified "lastModified"`,
      ["tag10", "tag11", "tag12", "tag13", "tag14"]
    );

    return rows.map(row => ({
      __typename: "PostTag",
      ...row,
      dateCreated: dateToISOString(row.dateCreated),
      lastModified: row.lastModified
        ? dateToISOString(row.lastModified)
        : row.lastModified,
    }));
  } catch (err) {
    console.log("Create Test Post Tags Error - ", err);
    throw new Error("Unable to create test post tags");
  }
};

export default createTestPostTags;

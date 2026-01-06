import type { Pool } from "pg";

import dateToISOString from "@utils/dateToISOString";
import type { PostTag } from "@resolverTypes";

const createTestPostTags = async (
  db: Pool,
  numberOfTags = 5
): Promise<PostTag[]> => {
  const values: string[] = [];
  let params = "";

  for (let i = 1; i <= numberOfTags; i++) {
    const comma = i === 1 ? "" : ", ";
    values.push(`Post Tag ${i}`);
    params = `${params}${comma}($${i})`;
  }

  try {
    const { rows } = await db.query<PostTag>(
      `INSERT INTO
        post_tags (name)
      VALUES ${params}
      RETURNING
        tag_id id,
        name,
        date_created "dateCreated",
        last_Modified "lastModified"`,
      values
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
    console.error("Create Test Post Tags Error - ", err);
    throw new Error("Unable to create test post tags");
  }
};

export default createTestPostTags;

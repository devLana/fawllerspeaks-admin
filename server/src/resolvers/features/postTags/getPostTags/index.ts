import { GraphQLError } from "graphql";

import { PostTags } from "@typeResolvers/postTags/PostTags";
import { ErrorResponse } from "@typeResolvers/commonResolvers";
import { clearAuthCookie } from "@utils/auth/cookies";
import type { PostTag } from "@appTypes/resolverTypes";
import type { GetPostTags } from "@appTypes/postTags/getPostTags";

const getPostTags: GetPostTags = async (_, __, { db, user, res }) => {
  try {
    const MSG = "Unable to get post tags";

    if (!user) {
      clearAuthCookie(res);
      return new ErrorResponse("UnauthorizedError", MSG);
    }

    const { rows: findUser } = await db.query<{ is_registered: boolean }>(
      `SELECT is_registered FROM users WHERE user_id = $1`,
      [user]
    );

    if (findUser.length === 0) {
      clearAuthCookie(res);
      return new ErrorResponse("UnauthorizedError", MSG);
    }

    if (!findUser[0].is_registered) {
      return new ErrorResponse("RegistrationError", MSG);
    }

    const { rows: tags } = await db.query<PostTag>(
      `SELECT
        name,
        tag_id id,
        date_created "dateCreated",
        last_Modified "lastModified"
      FROM post_tags`
    );

    tags.sort(({ name: tagName1 }, { name: tagName2 }) => {
      const match1 = /^\d+/.exec(tagName1);

      if (match1) {
        const match = /^\d+/.exec(tagName2);

        if (!match) return -1;

        return +match1[0] - +match[0];
      }

      const match2 = /\d+$/.exec(tagName1);

      if (match2) {
        if (/^\d+/.test(tagName2)) return 1;

        const match = /\d+$/.exec(tagName2);

        if (match) return +match2[0] - +match[0];

        if (tagName1.toUpperCase() < tagName2.toUpperCase()) return -1;

        if (tagName1.toUpperCase() > tagName2.toUpperCase()) return 1;

        return 0;
      }

      if (tagName1.toUpperCase() < tagName2.toUpperCase()) return -1;

      if (tagName1.toUpperCase() > tagName2.toUpperCase()) return 1;

      return 0;
    });

    return new PostTags(tags);
  } catch {
    // log any system error
    throw new GraphQLError("Unable to get post tags. Please try again later");
  }
};

export default getPostTags;

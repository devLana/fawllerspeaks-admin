import { GraphQLError } from "graphql";

import { PostTags } from "../types/PostTags";
import {
  AuthenticationError,
  RegistrationError,
  UnknownError,
} from "@utils/ObjectTypes";

import type { QueryResolvers, PostTag } from "@resolverTypes";
import type { ResolverFunc } from "@types";

type GetPostTags = ResolverFunc<QueryResolvers["getPostTags"]>;

const getPostTags: GetPostTags = async (_, __, { db, user }) => {
  if (!user) return new AuthenticationError("Unable to get post tags");

  try {
    const { rows: findUser } = await db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE user_id = $1`,
      [user]
    );

    if (findUser.length === 0) {
      return new UnknownError("Unable to get post tags");
    }

    if (!findUser[0].isRegistered) {
      return new RegistrationError("Unable to get post tags");
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
      const match1 = tagName1.match(/^\d+/);

      if (match1) {
        const match = tagName2.match(/^\d+/);

        if (!match) return -1;

        return +match1[0] - +match[0];
      }

      const match2 = tagName1.match(/\d+$/);

      if (match2) {
        if (/^\d+/.test(tagName2)) return 1;

        const match = tagName2.match(/\d+$/);

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
    throw new GraphQLError("Unable to get post tags. Please try again later");
  }
};

export default getPostTags;

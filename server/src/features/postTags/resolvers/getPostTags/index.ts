import { GraphQLError } from "graphql";

import { PostTags } from "../types";
import { AuthenticationError, RegistrationError, UnknownError } from "@utils";

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
      FROM post_tags
      ORDER BY name`
    );

    return new PostTags(tags);
  } catch {
    throw new GraphQLError("Unable to get post tags. Please try again later");
  }
};

export default getPostTags;

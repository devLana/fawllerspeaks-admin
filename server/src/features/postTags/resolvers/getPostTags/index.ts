import { GraphQLError } from "graphql";

import { PostTags } from "../types";
import { NotAllowedError } from "@utils";

import type { QueryResolvers, PostTag } from "@resolverTypes";
import type { ResolverFunc } from "@types";

type GetPostTags = ResolverFunc<QueryResolvers["getPostTags"]>;

const getPostTags: GetPostTags = async (_, __, { db, user }) => {
  try {
    if (!user) return new NotAllowedError("Unable to get post tags");

    const { rows: findUser } = await db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE user_id = $1`,
      [user]
    );

    if (findUser.length === 0 || !findUser[0].isRegistered) {
      return new NotAllowedError("Unable to get post tags");
    }

    const { rows: tags } = await db.query<PostTag>(
      `SELECT
        name,
        tag_id id,
        date_created "dateCreated",
        last_Modified "lastModified"
      FROM post_tags`
    );

    return new PostTags(tags);
  } catch {
    throw new GraphQLError("Unable to get post tags. Please try again later");
  }
};

export default getPostTags;

import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { GetPostValidationError } from "./types/GetPostValidationError";
import { GetPostWarning } from "./types/GetPostWarning";
import { SinglePost } from "../types/SinglePost";
import {
  AuthenticationError,
  NotAllowedError,
  RegistrationError,
} from "@utils/ObjectTypes";

import { getPostSchema as schema } from "./utils/getPost.validator";
import deleteSession from "@utils/deleteSession";

import type { QueryResolvers } from "@resolverTypes";
import type { GetPostDBData, PostFieldResolver, ResolverFunc } from "@types";

type GetPost = PostFieldResolver<ResolverFunc<QueryResolvers["getPost"]>>;

const getPost: GetPost = async (_, { slug }, { user, db, req, res }) => {
  try {
    if (!user) {
      await deleteSession(db, req, res);
      return new AuthenticationError("Unable to retrieve post");
    }

    const postSlug = await schema.validateAsync(slug);

    const { rows: foundUser } = await db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE user_id = $1`,
      [user]
    );

    if (foundUser.length === 0) {
      await deleteSession(db, req, res);
      return new NotAllowedError("Unable to retrieve post");
    }

    if (!foundUser[0].isRegistered) {
      return new RegistrationError("Unable to retrieve post");
    }

    const { rows: foundPost } = await db.query<Omit<GetPostDBData, "postId">>(
      `SELECT
        p.post_id id,
        p.title,
        p.description,
        p.excerpt,
        p.content,
        json_build_object(
          'image', u.image,
          'name', u.first_name||' '||u.last_name
        ) author,
        p.status,
        json_build_object(
          'href', p.slug,
          'slug', p.slug
        ) url,
        p.image_banner "imageBanner",
        p.date_created "dateCreated",
        p.date_published "datePublished",
        p.last_modified "lastModified",
        p.views,
        p.is_in_bin "isInBin",
        p.is_deleted "isDeleted",
        json_agg(json_build_object(
          'id', pt.tag_id,
          'name', pt.name,
          'dateCreated', pt.date_created,
          'lastModified', pt.last_modified
        )) FILTER (WHERE pt.tag_id IS NOT NULL) tags
      FROM posts p JOIN users u ON p.author = u.user_id
      LEFT JOIN post_tags pt ON pt.id = ANY (p.tags)
      WHERE p.slug = $1
      GROUP BY p.id, p.post_id, u.first_name, u.last_name, u.image`,
      [postSlug]
    );

    if (foundPost.length === 0) {
      return new GetPostWarning("Unable to retrieve post");
    }

    return new SinglePost(foundPost[0]);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new GetPostValidationError(err.message);
    }

    throw new GraphQLError("Unable to retrieve post. Please try again later");
  }
};

export default getPost;

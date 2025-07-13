import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { Posts } from "../types/Posts";
import { PostIdsValidationError } from "../types/PostIdsValidationError";
import { PostsWarning } from "../types/PostsWarning";
import {
  AuthenticationError,
  NotAllowedError,
  RegistrationError,
  UnknownError,
} from "@utils/ObjectTypes";
import { binPostValidator as schema } from "./utils/binPost.validator";
import deleteSession from "@utils/deleteSession";

import type { MutationResolvers as Resolvers } from "@resolverTypes";
import type { GetPostDBData, PostFieldResolver, ResolverFunc } from "@types";

type BinPosts = PostFieldResolver<ResolverFunc<Resolvers["binPosts"]>>;

const binPosts: BinPosts = async (_, { postIds }, { req, res, db, user }) => {
  const postOrPosts = postIds.length > 1 ? "posts" : "post";

  try {
    if (!user) {
      void deleteSession(db, req, res);
      return new AuthenticationError(`Unable to move ${postOrPosts} to bin`);
    }

    const ids = await schema.validateAsync(postIds, { abortEarly: false });

    const { rows: foundUser } = await db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE user_id = $1`,
      [user]
    );

    if (foundUser.length === 0) {
      void deleteSession(db, req, res);
      return new NotAllowedError(`Unable to move ${postOrPosts} to bin`);
    }

    if (!foundUser[0].isRegistered) {
      return new RegistrationError(`Unable to move ${postOrPosts} to bin`);
    }

    const { rows: binnedPosts } = await db.query<Omit<GetPostDBData, "postId">>(
      `WITH bin_posts AS (
        UPDATE posts SET
          is_in_bin = TRUE,
          binned_at = CURRENT_TIMESTAMP(3)
        WHERE post_id = ANY ($1) AND is_in_bin = FALSE
        RETURNING *
      )
      SELECT
        bp.post_id id,
        bp.title,
        bp.description,
        bp.excerpt,
        pc.content,
        json_build_object(
          'image', u.image,
          'name', u.first_name||' '||u.last_name
        ) author,
        bp.status,
        json_build_object(
          'slug', bp.slug,
          'href', bp.slug
        ) url,
        bp.image_banner "imageBanner",
        bp.date_created "dateCreated",
        bp.date_published "datePublished",
        bp.last_modified "lastModified",
        bp.views,
        bp.binned_at "binnedAt",
        json_agg(
          json_build_object(
            'id', pt.tag_id,
            'name', pt.name,
            'dateCreated', pt.date_created,
            'lastModified', pt.last_modified
          )
        ) FILTER (WHERE pt.tag_id IS NOT NULL) tags
      FROM bin_posts bp
      JOIN users u ON bp.author = u.id
      LEFT JOIN post_contents pc ON bp.id = pc.post_id
      LEFT JOIN post_tags_to_posts ptp ON bp.id = ptp.post_id
      LEFT JOIN post_tags pt ON ptp.tag_id = pt.id
      GROUP BY
        bp.post_id,
        bp.title,
        bp.description,
        bp.excerpt,
        pc.content,
        u.image,
        u.first_name,
        u.last_name,
        bp.status,
        bp.slug,
        bp.image_banner,
        bp.date_created,
        bp.date_published,
        bp.last_modified,
        bp.views,
        bp.binned_at`,
      [ids]
    );

    if (binnedPosts.length === 0) {
      return new UnknownError(
        `None of the selected ${postOrPosts} could be moved to bin`
      );
    }

    if (binnedPosts.length < ids.length) {
      const message = `${binnedPosts.length} out of ${ids.length} posts moved to bin`;
      return new PostsWarning(binnedPosts, message);
    }

    return new Posts(binnedPosts);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new PostIdsValidationError(err.message);
    }

    throw new GraphQLError(
      `Unable to move ${postOrPosts} to bin. Please try again later`
    );
  }
};

export default binPosts;

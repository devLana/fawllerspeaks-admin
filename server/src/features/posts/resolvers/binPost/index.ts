import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { SinglePost } from "../types/SinglePost";
import { PostIdValidationError } from "../types/PostIdValidationError";
import {
  AuthenticationError,
  NotAllowedError,
  RegistrationError,
  UnknownError,
} from "@utils/ObjectTypes";
import { NotAllowedPostActionError } from "../types/NotAllowedPostActionError";
import { binPostValidator as schema } from "./utils/binPost.validator";
import deleteSession from "@utils/deleteSession";

import type { MutationResolvers as Resolvers } from "@resolverTypes";
import type { GetPostDBData, PostFieldResolver, ResolverFunc } from "@types";

type BinPost = PostFieldResolver<ResolverFunc<Resolvers["binPost"]>>;

const binPost: BinPost = async (_, { postId }, { req, res, db, user }) => {
  try {
    if (!user) {
      void deleteSession(db, req, res);
      return new AuthenticationError("Unable to move post to bin");
    }

    const post = await schema.validateAsync(postId);

    const findUser = db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE user_id = $1`,
      [user]
    );

    const findPost = db.query<{ is_in_bin: boolean }>(
      `SELECT is_in_bin FROM posts WHERE post_id = $1`,
      [post]
    );

    const [{ rows: foundUser }, { rows: foundPost }] = await Promise.all([
      findUser,
      findPost,
    ]);

    if (foundUser.length === 0) {
      void deleteSession(db, req, res);
      return new NotAllowedError("Unable to move post to bin");
    }

    if (!foundUser[0].isRegistered) {
      return new RegistrationError("Unable to move post to bin");
    }

    if (foundPost.length === 0) {
      return new UnknownError("Unable to move post to bin");
    }

    if (foundPost[0].is_in_bin) {
      return new NotAllowedPostActionError(
        "This blog post has already been sent to bin"
      );
    }

    const { rows: binnedPost } = await db.query<Omit<GetPostDBData, "postId">>(
      `WITH bin_post AS (
        UPDATE posts SET
          is_in_bin = TRUE,
          binned_at = CURRENT_TIMESTAMP(3)
        WHERE post_id = $1
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
        bp.is_in_bin "isBinned",
        bp.binned_at "binnedAt",
        json_agg(
          json_build_object(
            'id', pt.tag_id,
            'name', pt.name,
            'dateCreated', pt.date_created,
            'lastModified', pt.last_modified
          )
        ) FILTER (WHERE pt.tag_id IS NOT NULL) tags
      FROM bin_post bp
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
        bp.is_in_bin,
        bp.binned_at`,
      [post]
    );

    const [binned] = binnedPost;

    return new SinglePost(binned);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new PostIdValidationError(err.message);
    }

    throw new GraphQLError(
      "Unable to move post to bin. Please try again later"
    );
  }
};

export default binPost;

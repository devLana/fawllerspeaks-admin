import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { NotAllowedPostActionError } from "../types/NotAllowedPostActionError";
import { PostIdValidationError } from "../types/PostIdValidationError";
import { SinglePost } from "../types/SinglePost";
import {
  AuthenticationError,
  NotAllowedError,
  RegistrationError,
  Response,
  UnknownError,
} from "@utils/ObjectTypes";
import deleteSession from "@utils/deleteSession";
import { unpublishPostValidator as schema } from "./utils/unpublishPost.validator";

import type {
  PostStatus,
  MutationResolvers as Resolvers,
} from "@resolverTypes";
import type { GetPostDBData, PostFieldResolver, ResolverFunc } from "@types";

type Resolver = PostFieldResolver<ResolverFunc<Resolvers["unpublishPost"]>>;

const unpublishPost: Resolver = async (_, { postId }, ctx) => {
  try {
    const { db, req, res, user } = ctx;

    if (!user) {
      void deleteSession(db, req, res);
      return new AuthenticationError("Unable to unpublish post");
    }

    const post = await schema.validateAsync(postId);

    const findUser = db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE user_id = $1`,
      [user]
    );

    const findPost = db.query<{ status: PostStatus; is_in_bin: boolean }>(
      `SELECT status, is_in_bin FROM posts WHERE post_id = $1`,
      [post]
    );

    const [{ rows: foundUser }, { rows: foundPost }] = await Promise.all([
      findUser,
      findPost,
    ]);

    if (foundUser.length === 0) {
      void deleteSession(db, req, res);
      return new NotAllowedError("Unable to unpublish post");
    }

    if (!foundUser[0].isRegistered) {
      return new RegistrationError("Unable to unpublish post");
    }

    if (foundPost.length === 0) {
      return new UnknownError("Unable to unpublish post");
    }

    if (foundPost[0].is_in_bin) {
      return new NotAllowedPostActionError(
        "This blog post cannot be unpublished"
      );
    }

    if (foundPost[0].status === "Draft") {
      return new NotAllowedPostActionError(
        "A Draft post cannot be unpublished"
      );
    }

    if (foundPost[0].status === "Unpublished") {
      return new Response("This blog post is already Unpublished", "WARN");
    }

    const { rows: updatePost } = await db.query<Omit<GetPostDBData, "postId">>(
      `WITH update_status AS (
        UPDATE posts
        SET
          status = 'Unpublished',
          date_published = NULL,
          last_modified = CURRENT_TIMESTAMP(3)
        WHERE post_id = $1
        RETURNING id, status, date_published, last_modified
      )
      SELECT
        p.post_id id,
        p.title,
        p.description,
        p.excerpt,
        pc.content,
        json_build_object(
          'image', u.image,
          'name', u.first_name||' '||u.last_name
        ) author,
        us.status,
        json_build_object(
          'slug', p.slug,
          'href', p.slug
        ) url,
        p.image_banner "imageBanner",
        p.date_created "dateCreated",
        us.date_published "datePublished",
        us.last_modified "lastModified",
        p.views,
        p.is_in_bin "isBinned",
        p.binned_at "binnedAt",
        json_agg(
          json_build_object(
            'id', pt.tag_id,
            'name', pt.name,
            'dateCreated', pt.date_created,
            'lastModified', pt.last_modified
          )
        ) FILTER (WHERE pt.id IS NOT NULL) tags
      FROM posts p
      JOIN users u ON p.author = u.id
      LEFT JOIN update_status us ON p.id = us.id
      LEFT JOIN post_contents pc ON p.id = pc.post_id
      LEFT JOIN post_tags_to_posts ptp ON p.id = ptp.post_id
      LEFT JOIN post_tags pt ON ptp.tag_id = pt.id
      WHERE p.post_id = $1
      GROUP BY
        p.post_id,
        p.title,
        p.description,
        p.excerpt,
        pc.content,
        u.image,
        u.first_name,
        u.last_name,
        us.status,
        p.slug,
        p.image_banner,
        p.date_created,
        us.date_published,
        us.last_modified,
        p.views,
        p.is_in_bin,
        p.binned_at`,
      [post]
    );

    const [updated] = updatePost;

    return new SinglePost(updated);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new PostIdValidationError(err.message);
    }

    throw new GraphQLError("Unable to unpublish post. Please try again later");
  }
};

export default unpublishPost;

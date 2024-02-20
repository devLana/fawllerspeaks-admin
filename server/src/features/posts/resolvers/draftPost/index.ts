import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { supabaseEvent } from "@lib/supabase/supabaseEvent";
import { getPostTags, getPostUrl } from "@features/posts/utils";
import {
  SinglePost,
  DuplicatePostTitleError,
  PostValidationError,
} from "../types";
import { draftPostSchema as schema } from "./utils/draftPost.validator";
import {
  AuthenticationError,
  NotAllowedError,
  RegistrationError,
  UnknownError,
  generateErrorsObject,
} from "@utils";

import type { MutationResolvers, PostTag } from "@resolverTypes";
import type { ResolverFunc, PostDBData, ValidationErrorObject } from "@types";

type DraftPost = ResolverFunc<MutationResolvers["draftPost"]>;

interface User {
  isRegistered: boolean;
  name: string;
  image: string | null;
}

const draftPost: DraftPost = async (_, { post }, { db, user }) => {
  if (!user) {
    if (post.imageBanner) supabaseEvent.emit("removeImage", post.imageBanner);
    return new AuthenticationError("Unable to save post to draft");
  }

  try {
    const validated = await schema.validateAsync(post, { abortEarly: false });
    const { title, description, content, tags, imageBanner } = validated;

    const findUser = db.query<User>(
      `SELECT
        is_registered "isRegistered",
        concat(first_name,' ', last_name) name,
        image
      FROM users
      WHERE user_id = $1`,
      [user]
    );

    const findTitle = db.query(
      `SELECT id
      FROM posts
      WHERE lower(replace(replace(replace(title, '-', ''), ' ', ''), '_', '')) = $1`,
      [title.toLowerCase().replace(/[\s_-]/g, "")]
    );

    const [{ rows: foundUser }, { rows: foundTitle }] = await Promise.all([
      findUser,
      findTitle,
    ]);

    if (foundUser.length === 0) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new NotAllowedError("Unable to save post to draft");
    }

    const [{ name, image, isRegistered }] = foundUser;

    if (!isRegistered) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new RegistrationError("Unable to save post to draft");
    }

    if (foundTitle.length > 0) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);

      return new DuplicatePostTitleError(
        "A post with that title has already been created"
      );
    }

    let postTags: PostTag[] | null = null;
    let passedTags: readonly string[] | null = null;

    if (tags) {
      const gottenTags = await getPostTags(db, tags);

      if (!gottenTags || gottenTags.length < tags.length) {
        if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
        return new UnknownError("Unknown post tag id provided");
      }

      postTags = gottenTags;
      passedTags = tags;
    }

    const { rows: draftedPost } = await db.query<PostDBData>(
      `INSERT INTO posts (
        title,
        description,
        content,
        author,
        status,
        image_banner
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        post_id "postId",
        date_created "dateCreated",
        date_published "datePublished",
        last_modified "lastModified",
        views,
        is_in_bin "isInBin",
        is_deleted "isDeleted"`,
      [title, description, content, user, "Draft", imageBanner]
    );

    const [drafted] = draftedPost;

    if (passedTags && passedTags.length > 0) {
      void db.query(
        `UPDATE post_tags
        SET posts = array_append(posts, $1)
        WHERE tag_id = ANY ($2)`,
        [drafted.id, passedTags]
      );
    }

    const { url, slug } = getPostUrl(title);

    return new SinglePost({
      id: drafted.postId,
      title,
      description,
      content,
      author: { name, image },
      status: "Draft",
      url,
      slug,
      imageBanner,
      dateCreated: drafted.dateCreated,
      datePublished: drafted.datePublished,
      lastModified: drafted.lastModified,
      views: drafted.views,
      isInBin: drafted.isInBin,
      isDeleted: drafted.isDeleted,
      tags: postTags,
    });
  } catch (err) {
    if (post.imageBanner) supabaseEvent.emit("removeImage", post.imageBanner);

    if (err instanceof ValidationError) {
      const errors = generateErrorsObject(err.details) as ValidationErrorObject<
        typeof post
      >;

      return new PostValidationError(errors);
    }

    throw new GraphQLError(
      "Unable to save post to draft. Please try again later"
    );
  }
};

export default draftPost;

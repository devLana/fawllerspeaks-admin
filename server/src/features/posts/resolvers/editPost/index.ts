import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { supabaseEvent } from "@lib/supabase/supabaseEvent";
import getPostSlug from "@features/posts/utils/getPostSlug";
import { editPostValidator as schema } from "./utils/editPost.validator";
import { EditPostValidationError } from "./types/EditPostValidationError";
import { DuplicatePostTitleError } from "../types/DuplicatePostTitleError";
import { SinglePost } from "../types/SinglePost";
import {
  AuthenticationError,
  ForbiddenError,
  NotAllowedError,
  RegistrationError,
  UnknownError,
} from "@utils/ObjectTypes";
import generateErrorsObject from "@utils/generateErrorsObject";
import deleteSession from "@utils/deleteSession";

import type { MutationResolvers, PostStatus } from "@resolverTypes";
import type { PostDBData, PostFieldResolver, ResolverFunc } from "@types";

type EditPost = PostFieldResolver<ResolverFunc<MutationResolvers["editPost"]>>;

interface FindById {
  postStatus: PostStatus;
  postImageBanner: string | null;
  postTags: number[] | null;
}

interface FindBySlug {
  id: string;
  postSlug: string;
  postTitle: string;
}

interface User {
  isRegistered: boolean;
  userName: string;
  userImage: string | null;
}

interface EditedData extends Omit<PostDBData, "id"> {
  imageBanner: string | null;
}

const editPost: EditPost = async (_, { post }, { user, db, req, res }) => {
  const postImage = post.imageBanner && post.imageBanner.trim();

  try {
    if (!user) {
      if (postImage) supabaseEvent.emit("removeImage", postImage);
      void deleteSession(db, req, res);
      return new AuthenticationError("Unable to edit post");
    }

    const postInput = await schema.validateAsync(post, { abortEarly: false });
    const { id, title, description, excerpt, content, tagIds } = postInput;
    const { imageBanner, editStatus } = postInput;
    const slug = getPostSlug(title);

    const { rows: loggedInUser } = await db.query<User>(
      `SELECT
        is_registered "isRegistered",
        first_name||' '||last_name "userName",
        image "userImage"
      FROM users
      WHERE user_id = $1`,
      [user]
    );

    if (loggedInUser.length === 0) {
      void deleteSession(db, req, res);
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new NotAllowedError("Unable to edit post");
    }

    const [{ userName, userImage, isRegistered }] = loggedInUser;

    if (!isRegistered) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new RegistrationError("Unable to edit post");
    }

    const findPostById = db.query<FindById>(
      `SELECT
        status "postStatus",
        image_banner "postImageBanner",
        tags "postTags"
      FROM posts
      WHERE post_id = $1`,
      [id]
    );

    const checkPostSlug = db.query<FindBySlug>(
      `SELECT
        post_id id,
        slug "postSlug",
        title "postTitle"
      FROM posts
      WHERE slug = $1 OR lower(title) = $2`,
      [slug, title.toLowerCase()]
    );

    const [{ rows: foundPost }, { rows: checkedSlug }] = await Promise.all([
      findPostById,
      checkPostSlug,
    ]);

    if (foundPost.length === 0) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new UnknownError("Unable to edit post");
    }

    const [{ postImageBanner, postTags }] = foundPost;
    let [{ postStatus }] = foundPost;
    let datePublished = "";

    if (editStatus) {
      if (postStatus === "Draft" || postStatus === "Unpublished") {
        postStatus = "Published";
        datePublished = ",date_published = CURRENT_TIMESTAMP(3)";
      } else {
        postStatus = "Unpublished";
        datePublished = ",date_published = NULL";
      }
    }

    if (
      (postStatus === "Published" || postStatus === "Unpublished") &&
      (!description || !excerpt || !content)
    ) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);

      return new EditPostValidationError({
        ...(!content && { contentError: "Provide post content" }),
        ...(!description && { descriptionError: "Provide post description" }),
        ...(!excerpt && { excerptError: "Provide post excerpt" }),
      });
    }

    if (checkedSlug.length > 0 && checkedSlug[0].id !== id) {
      const [{ postSlug, postTitle }] = checkedSlug;

      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);

      if (postSlug === slug) {
        return new ForbiddenError(
          "This blog post's title generates a slug that already exists. Please ensure the provided title is as unique as possible"
        );
      }

      return new DuplicatePostTitleError(
        `A similar post title already exists - '${postTitle}'. Please ensure every post has a unique title`
      );
    }

    const image = imageBanner === undefined ? postImageBanner : imageBanner;
    let query: string;
    let param: unknown[];

    if (tagIds) {
      query = `
        WITH post_tag_ids AS (
          SELECT NULLIF(
            ARRAY(
              SELECT id
              FROM post_tags
              WHERE tag_id = ANY ($1::uuid[])
            ),
            ARRAY[]::smallint[]
          ) AS tag_ids
        ),
        edited_post AS (
          UPDATE posts SET
            title = $2,
            description = $3,
            excerpt = $4,
            content = $5,
            slug = $6,
            image_banner = $7,
            status = $8,
            last_modified = CURRENT_TIMESTAMP(3),
            tags = (SELECT tag_ids FROM post_tag_ids)
            ${datePublished}
          WHERE post_id = $9
          RETURNING
            image_banner,
            date_created,
            date_published,
            last_modified,
            views,
            is_in_bin,
            is_deleted,
            tags
        )
      `;

      param = [
        `{${tagIds.join(",")}}`,
        title,
        description,
        excerpt,
        content,
        slug,
        image,
        postStatus,
        id,
      ];
    } else {
      query = `
        WITH edited_post AS (
          UPDATE posts SET
            title = $1,
            description = $2,
            excerpt = $3,
            content = $4,
            slug = $5,
            image_banner = $6,
            status = $7,
            tags = $8,
            last_modified = CURRENT_TIMESTAMP(3)
            ${datePublished}
          WHERE post_id = $9
          RETURNING
            image_banner,
            date_created,
            date_published,
            last_modified,
            views,
            is_in_bin,
            is_deleted,
            tags
        )
      `;

      param = [
        title,
        description,
        excerpt,
        content,
        slug,
        image,
        postStatus,
        tagIds === undefined ? postTags : tagIds,
        id,
      ];
    }

    const { rows: editedPost } = await db.query<EditedData>(
      `
        ${query}
        SELECT
          ep.image_banner "imageBanner",
          ep.date_created "dateCreated",
          ep.date_published "datePublished",
          ep.last_modified "lastModified",
          ep.views,
          ep.is_in_bin "isInBin",
          ep.is_deleted "isDeleted",
          json_agg(json_build_object(
            'id', pt.tag_id,
            'name', pt.name,
            'dateCreated', pt.date_created,
            'lastModified', pt.last_modified
          )) FILTER (WHERE pt.tag_id IS NOT NULL) tags
        FROM edited_post ep LEFT JOIN post_tags pt
        ON pt.id = ANY (ep.tags)
        GROUP BY
          ep.image_banner,
          ep.date_created,
          ep.date_published,
          ep.last_modified,
          ep.views,
          ep.is_in_bin,
          ep.is_deleted
      `,
      param
    );

    if (imageBanner !== undefined && postImageBanner) {
      supabaseEvent.emit("removeImage", postImageBanner);
    }

    const [edited] = editedPost;

    return new SinglePost({
      id,
      title,
      description,
      excerpt,
      content,
      author: { name: userName, image: userImage },
      status: postStatus,
      url: { slug, href: slug },
      imageBanner: edited.imageBanner,
      dateCreated: edited.dateCreated,
      datePublished: edited.datePublished,
      lastModified: edited.lastModified,
      views: edited.views,
      isInBin: edited.isInBin,
      isDeleted: edited.isDeleted,
      tags: edited.tags,
    });
  } catch (err) {
    if (postImage) supabaseEvent.emit("removeImage", postImage);

    if (err instanceof ValidationError) {
      return new EditPostValidationError(generateErrorsObject(err.details));
    }

    throw new GraphQLError("Unable to edit post. Please try again later");
  }
};

export default editPost;

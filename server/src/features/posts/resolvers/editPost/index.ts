import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { supabaseEvent } from "@lib/supabase/supabaseEvent";
import getPostSlug from "@features/posts/utils/getPostSlug";
import { editPostValidator as schema } from "./utils/editPost.validator";
import { EditPostValidationError } from "./types/EditPostValidationError";
import { DuplicatePostTitleError } from "../types/DuplicatePostTitleError";
import { NotAllowedPostActionError } from "../types/NotAllowedPostActionError";
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
  isBinned: boolean;
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
        is_in_bin "isBinned"
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

    const [{ postImageBanner, isBinned }] = foundPost;

    if (isBinned) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new NotAllowedPostActionError("This blog post cannot be edited");
    }

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

    if (postStatus !== "Draft" && (!description || !excerpt || !content)) {
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
    const tags = tagIds ? `{${tagIds.join(",")}}` : tagIds;

    const { rows: editedPost } = await db.query<PostDBData>(
      `WITH edit_post AS (
        UPDATE posts SET
          title = $1,
          description = $2,
          excerpt = $3,
          slug = $4,
          status = $5,
          image_banner = $6,
          last_modified = CURRENT_TIMESTAMP(3)
          ${datePublished}
        WHERE post_id = $7
        RETURNING *
      ),
      resolved_tags AS (
        SELECT id, tag_id, name, date_created, last_modified
        FROM post_tags         
        WHERE tag_id = ANY ($8::uuid[])
      ),
      tags_to_insert AS (
        SELECT rt.id
        FROM resolved_tags rt LEFT JOIN post_tags_to_posts ptp
        ON rt.id = ptp.tag_id AND ptp.post_id = (SELECT id FROM edit_post)
        WHERE ptp.tag_id IS NULL
      ),
      insert_tags AS (
        INSERT INTO post_tags_to_posts (post_id, tag_id)
        SELECT ep.id, ti.id
        FROM edit_post ep CROSS JOIN tags_to_insert ti
      ),
      tags_to_delete AS (
        SELECT ptp.tag_id
        FROM resolved_tags rt RIGHT JOIN post_tags_to_posts ptp
        ON ptp.tag_id = rt.id AND ptp.post_id = (SELECT id FROM edit_post)
        WHERE rt.id IS NULL AND EXISTS (SELECT 1 FROM resolved_tags)
      ),
      delete_tags AS (
        DELETE FROM post_tags_to_posts
        WHERE post_id = (SELECT id FROM edit_post)
        AND tag_id IN (SELECT tag_id FROM tags_to_delete)
      ),
      delete_content AS (
        DELETE FROM post_contents
        WHERE post_id = (SELECT id FROM edit_post)
        AND $9::text IS NULL
      ),
      insert_or_upsert_content AS (
        INSERT INTO post_contents (post_id, content)
        SELECT id, $9::text
        FROM edit_post
        WHERE $9::text IS NOT NULL
        ON CONFLICT (post_id)
        DO UPDATE SET content = EXCLUDED.content
      )
      SELECT
        ep.post_id id,
        ep.slug,
        ep.title,
        ep.description,
        ep.excerpt,
        $9::text content,
        ep.image_banner "imageBanner",
        ep.status,
        ep.date_created "dateCreated",
        ep.date_published "datePublished",
        ep.last_modified "lastModified",
        ep.views,
        ep.is_in_bin "isBinned",
        ep.binned_at "binnedAt",
        json_agg(
          json_build_object(
            'id', rt.tag_id,
            'name', rt.name,
            'dateCreated', rt.date_created,
            'lastModified', rt.last_modified
          )
        ) FILTER (WHERE rt.id IS NOT NULL) tags
      FROM edit_post ep
      LEFT JOIN resolved_tags rt ON TRUE
      GROUP BY
        ep.post_id,
        ep.slug,
        ep.title,
        ep.description,
        ep.excerpt,
        $9::text,
        ep.image_banner,
        ep.status,
        ep.date_created,
        ep.date_published,
        ep.last_modified,
        ep.views,
        ep.is_in_bin,
        ep.binned_at`,
      [title, description, excerpt, slug, postStatus, image, id, tags, content]
    );

    if (imageBanner !== undefined && postImageBanner) {
      supabaseEvent.emit("removeImage", postImageBanner);
    }

    const [edited] = editedPost;

    return new SinglePost({
      id: edited.id,
      title: edited.title,
      description: edited.description,
      excerpt: edited.excerpt,
      content: edited.content,
      author: { name: userName, image: userImage },
      status: postStatus,
      url: { slug: edited.slug, href: edited.slug },
      imageBanner: edited.imageBanner,
      dateCreated: edited.dateCreated,
      datePublished: edited.datePublished,
      lastModified: edited.lastModified,
      views: edited.views,
      isBinned: edited.isBinned,
      binnedAt: edited.binnedAt,
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

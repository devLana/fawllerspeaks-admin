import { Worker } from "node:worker_threads";
import path from "node:path";
import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";

// import deletePostTagsWorker from "./deletePostTagsWorker";
import { PostTags, PostTagsWarning } from "../types";
import { DeletePostTagsValidationError } from "./DeletePostTagsValidationError";
import { NotAllowedError, UnknownError } from "@utils";

import type { MutationResolvers, PostTag } from "@resolverTypes";
import type { ResolverFunc } from "@types";

type DeletePostTags = ResolverFunc<MutationResolvers["deletePostTags"]>;

const deletePostTags: DeletePostTags = async (_, { tagIds }, { db, user }) => {
  const schema = Joi.array<typeof tagIds>()
    .required()
    .items(
      Joi.string().trim().guid({ version: "uuidv4", separator: "-" }).messages({
        "string.empty": "Input tags cannot contain empty values",
        "string.guid": "Invalid post tag id",
      })
    )
    .min(1)
    .max(10)
    .unique()
    .messages({
      "array.max": "Input tags can only contain at most {{#limit}} tags",
      "array.min": "No post tags were provided",
      "array.unique": "Input tags can only contain unique tag ids",
      "array.base": "Post tags input must be an array",
    });

  const tagOrTags = tagIds.length > 1 ? "tags" : "tag";

  try {
    if (!user) return new NotAllowedError(`Unable to delete post ${tagOrTags}`);

    const validatedTagIds = await schema.validateAsync(tagIds, {
      abortEarly: false,
    });

    const { rows: findUser } = await db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE user_id = $1`,
      [user]
    );

    if (findUser.length === 0 || !findUser[0].isRegistered) {
      return new NotAllowedError(`Unable to delete post ${tagOrTags}`);
    }

    const { rows: deletedTags } = await db.query<PostTag>(
      `DELETE FROM post_tags WHERE
        tag_id = ANY ($1)
      RETURNING
        tag_id id,
        name,
        date_created "dateCreated",
        last_Modified "lastModified"`,
      [validatedTagIds]
    );

    // On a new thread delete from a post's tags, every tag in deletedTags
    if (deletedTags.length > 0) {
      // deletePostTagsWorker(deletedTags);
      const worker = new Worker(
        path.join(__dirname, "deletePostTagsWorker.ts")
      );
      worker.postMessage(deletedTags);
      worker.on("error", err => {
        console.log("Delete post tags worker thread error", err);
      });
    }

    const set = new Set<string>();
    const notDeletedTags: string[] = [];

    deletedTags.forEach(deletedTag => {
      set.add(deletedTag.id);
    });

    for (const validatedTagId of validatedTagIds) {
      if (set.has(validatedTagId)) continue;
      notDeletedTags.push(validatedTagId);
    }

    if (notDeletedTags.length > 0) {
      const notDeletedTagOrTags = notDeletedTags.length > 1 ? "tags" : "tag";

      if (deletedTags.length === 0) {
        return new UnknownError(
          `The provided post ${notDeletedTagOrTags} could not be deleted`
        );
      }

      const [{ name }] = deletedTags;
      const remainingTags = deletedTags.length - 1;
      const deletedTagOrTags = remainingTags > 1 ? "tags" : "tag";

      const msg =
        remainingTags === 0
          ? `${name} deleted`
          : `${name} and ${remainingTags} other post ${deletedTagOrTags} deleted`;

      const message = `${msg}. ${notDeletedTags.length} post ${notDeletedTagOrTags} could not be deleted`;

      return new PostTagsWarning(deletedTags, message);
    }

    return new PostTags(deletedTags);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new DeletePostTagsValidationError(err.details[0].message);
    }

    throw new GraphQLError(
      `Unable to delete post ${tagOrTags}. Please try again later`
    );
  }
};

export default deletePostTags;

// import { Worker } from "node:worker_threads";
// import path from "node:path";

import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

// import deletePostTagsWorker from "./deletePostTagsWorker";
import { PostTags, PostTagsWarning } from "../types";
import { DeletePostTagsValidationError } from "./types/DeletePostTagsValidationError";
import { deletePostTagsValidator as schema } from "./utils/deletePostTags.validator";
import {
  AuthenticationError,
  NotAllowedError,
  RegistrationError,
  UnknownError,
} from "@utils";

import type { MutationResolvers, PostTag } from "@resolverTypes";
import type { ResolverFunc } from "@types";

type DeletePostTags = ResolverFunc<MutationResolvers["deletePostTags"]>;

const deletePostTags: DeletePostTags = async (_, { tagIds }, { db, user }) => {
  const tagOrTags = tagIds.length > 1 ? "tags" : "tag";

  if (!user) {
    return new AuthenticationError(`Unable to delete post ${tagOrTags}`);
  }

  try {
    const validatedTagIds = await schema.validateAsync(tagIds, {
      abortEarly: false,
    });

    const { rows: findUser } = await db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE user_id = $1`,
      [user]
    );

    if (findUser.length === 0) {
      return new NotAllowedError(`Unable to delete post ${tagOrTags}`);
    }

    if (!findUser[0].isRegistered) {
      return new RegistrationError(`Unable to delete post ${tagOrTags}`);
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

    // Set up an event or worker to delete each deleted post tag from every post they were assigned to
    // if (deletedTags.length > 0) {
    //   // deletePostTagsWorker(deletedTags);
    //   const worker = new Worker(
    //     path.join(__dirname, "deletePostTagsWorker.ts")
    //   );
    //   worker.postMessage(deletedTags);
    //   worker.on("error", err => {
    //     console.log("Delete post tags worker thread error", err);
    //   });
    // }

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
      const _tagOrTags = notDeletedTags.length > 1 ? "tags" : "tag";

      if (deletedTags.length === 0) {
        return new UnknownError(
          `The provided post ${_tagOrTags} could not be deleted`
        );
      }

      const [{ name }] = deletedTags;
      const remainingTags = deletedTags.length - 1;
      const __tagOrTags = remainingTags > 1 ? "tags" : "tag";

      const msg =
        remainingTags === 0
          ? `${name} deleted`
          : `${name} and ${remainingTags} other post ${__tagOrTags} deleted`;

      const message = `${msg}. ${notDeletedTags.length} post ${_tagOrTags} could not be deleted`;
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

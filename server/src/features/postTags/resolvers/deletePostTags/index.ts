// import { Worker } from "node:worker_threads";
// import path from "node:path";

import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

// import deletePostTagsWorker from "./deletePostTagsWorker";
import { DeletePostTagsValidationError } from "./types/DeletePostTagsValidationError";
import { DeletedPostTags } from "./types/DeletedPostTags";
import { DeletedPostTagsWarning } from "./types/DeletedPostTagsWarning";
import { deletePostTagsValidator as schema } from "./utils/deletePostTags.validator";
import {
  AuthenticationError,
  NotAllowedError,
  RegistrationError,
  UnknownError,
} from "@utils/ObjectTypes";

import type { MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import deleteSession from "@utils/deleteSession";

type DeletePostTags = ResolverFunc<MutationResolvers["deletePostTags"]>;

const deletePostTags: DeletePostTags = async (_, { tagIds }, ctx) => {
  const { db, user, req, res } = ctx;
  const tagOrTags = tagIds.length > 1 ? "tags" : "tag";

  try {
    if (!user) {
      await deleteSession(db, req, res);
      return new AuthenticationError(`Unable to delete post ${tagOrTags}`);
    }

    const validatedTagIds = await schema.validateAsync(tagIds, {
      abortEarly: false,
    });

    const { rows: findUser } = await db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE user_id = $1`,
      [user]
    );

    if (findUser.length === 0) {
      await deleteSession(db, req, res);
      return new NotAllowedError(`Unable to delete post ${tagOrTags}`);
    }

    if (!findUser[0].isRegistered) {
      return new RegistrationError(`Unable to delete post ${tagOrTags}`);
    }

    const { rows: allDeletedTags } = await db.query<{
      id: string;
      name: string;
    }>(
      `DELETE FROM post_tags
      WHERE
        tag_id = ANY ($1)
      RETURNING
        tag_id id,
        name`,
      [validatedTagIds]
    );

    // Set up an event or worker to delete each deleted post tag from every post they were assigned to
    // if (allDeletedTags.length > 0) {
    //   // deletePostTagsWorker(allDeletedTags);
    //   const worker = new Worker(
    //     path.join(__dirname, "deletePostTagsWorker.ts")
    //   );
    //   worker.postMessage(allDeletedTags);
    //   worker.on("error", err => {
    //     console.log("Delete post tags worker thread error", err);
    //   });
    // }

    const deletedTagIdsSet = new Set<string>();
    const deletedTagIds: string[] = [];
    const notDeletedTags: string[] = [];

    allDeletedTags.forEach(deletedTag => {
      deletedTagIdsSet.add(deletedTag.id);
      deletedTagIds.push(deletedTag.id);
    });

    for (const validatedTagId of validatedTagIds) {
      if (deletedTagIdsSet.has(validatedTagId)) continue;
      notDeletedTags.push(validatedTagId);
    }

    if (notDeletedTags.length > 0) {
      const _tagOrTags = notDeletedTags.length > 1 ? "tags" : "tag";

      if (allDeletedTags.length === 0) {
        return new UnknownError(
          `The provided post ${_tagOrTags} could not be deleted`
        );
      }

      const [{ name }] = allDeletedTags;
      const remainingTags = allDeletedTags.length - 1;
      const __tagOrTags = remainingTags > 1 ? "tags" : "tag";

      const msg =
        remainingTags === 0
          ? `${name} deleted`
          : `${name} and ${remainingTags} other post ${__tagOrTags} deleted`;

      const message = `${msg}. ${notDeletedTags.length} post ${_tagOrTags} could not be deleted`;
      return new DeletedPostTagsWarning(deletedTagIds, message);
    }

    return new DeletedPostTags(deletedTagIds);
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

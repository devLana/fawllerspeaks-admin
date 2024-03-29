import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { DuplicatePostTagError } from "../types/DuplicatePostTagError";
import { PostTags } from "../types/PostTags";
import { CreatePostTagsValidationError } from "./types/CreatePostTagsValidationError";
import { CreatedPostTagsWarning } from "./types/CreatedPostTagsWarning";
import { createPostTagsValidator } from "./utils/createPostTags.validator";
import { formatTagName } from "@features/postTags/utils/formatTagName";
import {
  AuthenticationError,
  RegistrationError,
  UnknownError,
} from "@utils/ObjectTypes";

import type { ResolverFunc } from "@types";
import type { MutationResolvers, PostTag } from "@resolverTypes";
import deleteSession from "@utils/deleteSession";

type CreatePostTags = ResolverFunc<MutationResolvers["createPostTags"]>;

const createPostTags: CreatePostTags = async (_, { tags }, ctx) => {
  const { user, db, req, res } = ctx;
  const tagOrTags = tags.length > 1 ? "tags" : "tag";

  try {
    if (!user) {
      await deleteSession(db, req, res);
      return new AuthenticationError(`Unable to create post ${tagOrTags}`);
    }

    const validatedTags = await createPostTagsValidator.validateAsync(tags, {
      abortEarly: false,
    });

    const findUser = db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE user_id = $1`,
      [user]
    );

    const findTags = db.query<{ name: string }>(
      `SELECT name
      FROM post_tags
      WHERE lower(replace(replace(replace(name, '-', ''), ' ', ''), '_', '')) = ANY ($1)`,
      [validatedTags.map(tag => formatTagName(tag))]
    );

    const [{ rows: foundUser }, { rows: existingPostTags }] = await Promise.all(
      [findUser, findTags]
    );

    if (foundUser.length === 0) {
      await deleteSession(db, req, res);
      return new UnknownError(`Unable to create post ${tagOrTags}`);
    }

    if (!foundUser[0].isRegistered) {
      return new RegistrationError(`Unable to create post ${tagOrTags}`);
    }

    const set = new Set<string>();

    existingPostTags.forEach(tag => {
      set.add(formatTagName(tag.name));
    });

    const insertInput: (string | number)[] = [];
    const existingTags: string[] = [];
    let insertParams = "";
    let index = 1;
    let createdPostTags: PostTag[] = [];

    for (const validatedTag of validatedTags) {
      if (set.has(formatTagName(validatedTag))) {
        existingTags.push(validatedTag);
        continue;
      }

      const sqlParams = `($${index}), `;

      insertParams = `${insertParams}${sqlParams}`;
      insertInput.push(validatedTag);
      index += 1;
    }

    if (insertParams) {
      const sqlParams = insertParams.replace(/, $/, "");

      ({ rows: createdPostTags } = await db.query<PostTag>(
        `INSERT INTO
          post_tags (name)
        VALUES 
          ${sqlParams}
        RETURNING
          tag_id id,
          name,
          date_created "dateCreated",
          last_Modified "lastModified"`,
        insertInput
      ));
    }

    if (existingTags.length > 0) {
      if (createdPostTags.length === 0) {
        const msg =
          existingTags.length > 1
            ? "Post tags similar to the ones provided have already been created"
            : "A post tag similar to the one provided has already been created";

        return new DuplicatePostTagError(msg);
      }

      const [name] = existingTags;
      const remainingTags = existingTags.length - 1;
      const _tagOrTags = remainingTags > 1 ? "tags" : "tag";
      const createdTagOrTags = createdPostTags.length > 1 ? "tags" : "tag";

      const tagsMsg =
        remainingTags === 0
          ? `A post tag similar to '${name}' has already been created`
          : `Post tags similar to '${name}' and ${remainingTags} other post ${_tagOrTags} have already been created`;

      const msg = `${createdPostTags.length} post ${createdTagOrTags} created. ${tagsMsg}`;
      return new CreatedPostTagsWarning(createdPostTags, msg);
    }

    return new PostTags(createdPostTags);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new CreatePostTagsValidationError(err.details[0].message);
    }

    throw new GraphQLError(
      `Unable to create post ${tagOrTags}. Please try again later`
    );
  }
};

export default createPostTags;

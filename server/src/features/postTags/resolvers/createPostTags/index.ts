import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";

import { PostTags, PostTagsWarning, DuplicatePostTagError } from "../types";
import { CreatePostTagsValidationError } from "./CreatePostTagsValidationError";
import { DATE_COLUMN_MULTIPLIER, NotAllowedError } from "@utils";

import type { ResolverFunc } from "@types";
import type { MutationResolvers, PostTag } from "@resolverTypes";

type CreatePostTags = ResolverFunc<MutationResolvers["createPostTags"]>;

const createPostTags: CreatePostTags = async (_, { tags }, { user, db }) => {
  const schema = Joi.array<typeof tags>()
    .required()
    .items(
      Joi.string().trim().messages({
        "string.empty": "Input tags cannot contain empty values",
      })
    )
    .min(1)
    .max(10)
    .unique((a: string, b: string) => {
      const aStripped = a.replace(/[^a-zÀ-ȕ\d]/gi, "");
      const bStripped = b.replace(/[^a-zÀ-ȕ\d]/gi, "");

      return aStripped.toLowerCase() === bStripped.toLowerCase();
    })
    .messages({
      "array.max": "Input tags can only contain at most {{#limit}} tags",
      "array.min": "No post tags were provided",
      "array.unique": "Input tags can only contain unique tags",
      "array.base": "Post tags input must be an array",
    });

  const tagOrTags = tags.length > 1 ? "tags" : "tag";

  try {
    if (!user) return new NotAllowedError(`Unable to create post ${tagOrTags}`);

    const validatedTags = await schema.validateAsync(tags, {
      abortEarly: false,
    });

    const { rows } = await db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE user_id = $1`,
      [user]
    );

    if (rows.length === 0 || !rows[0].isRegistered) {
      return new NotAllowedError(`Unable to create post ${tagOrTags}`);
    }

    const lowercaseTags = validatedTags.map(tag => tag.toLowerCase());

    const { rows: alreadyPostTagsWarning } = await db.query<{ name: string }>(
      `SELECT name FROM post_tags WHERE lower(name) = ANY ($1)`,
      [lowercaseTags]
    );

    const set = new Set<string>();

    alreadyPostTagsWarning.forEach(tag => {
      set.add(tag.name.toLowerCase());
    });

    const insertInput: (string | number)[] = [];
    let insertParams = "";
    let index = 0;
    let createdTags: PostTag[] = [];

    for (const validatedTag of validatedTags) {
      if (set.has(validatedTag.toLowerCase())) continue;

      const modifier = index + 1;
      const str = `($${index + modifier}, $${index + modifier + 1}), `;

      insertParams = `${insertParams}${str}`;
      index += 1;

      insertInput.push(validatedTag, Date.now() / DATE_COLUMN_MULTIPLIER);
    }

    if (insertParams && insertInput.length > 0) {
      const sqlParams = insertParams.replace(/, $/, "");

      ({ rows: createdTags } = await db.query<PostTag>(
        `INSERT INTO
          post_tags (name, date_created)
        VALUES
          ${sqlParams}
        RETURNING
          tag_id id,
          name,
          date_created * ${DATE_COLUMN_MULTIPLIER} "dateCreated",
          last_Modified "lastModified"`,
        insertInput
      ));
    }

    if (alreadyPostTagsWarning.length > 0) {
      if (createdTags.length === 0) {
        const _tagOrTags = alreadyPostTagsWarning.length > 1 ? "tags" : "tag";
        const hasOrHave = alreadyPostTagsWarning.length > 1 ? "have" : "has";
        const msg = `The provided post ${_tagOrTags} ${hasOrHave} already been created`;

        return new DuplicatePostTagError(msg);
      }

      const [{ name }] = alreadyPostTagsWarning;
      const remainingTags = alreadyPostTagsWarning.length - 1;
      const _tagOrTags = remainingTags > 1 ? "tags" : "tag";
      const createdTagOrTags = createdTags.length > 1 ? "tags" : "tag";

      const tagsMsg =
        remainingTags === 0
          ? `${name} has already been created`
          : `'${name}' and ${remainingTags} other post ${_tagOrTags} have already been created`;

      const msg = `${createdTags.length} post ${createdTagOrTags} created. ${tagsMsg}`;
      return new PostTagsWarning(createdTags, msg);
    }

    return new PostTags(createdTags);
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

import generateBytes from "@utils/generateBytes";
import { SLUG_MAX_LENGTH } from "../constants";

const generateUniqueSlug = async (slug: string) => {
  const bytes = await generateBytes(2, "hex");

  if (slug.length > SLUG_MAX_LENGTH - 6) {
    const nextChar = slug.charAt(SLUG_MAX_LENGTH - 6);
    let trimmedSlug = slug.slice(0, SLUG_MAX_LENGTH - 6);

    if (/\p{L}|\p{N}/u.test(nextChar)) {
      trimmedSlug = trimmedSlug.replace(/-+(?:\p{L}|\p{N})*$/u, "");
    }

    return `${trimmedSlug}-${bytes}`;
  }

  return `${slug}-${bytes}`;
};

export default generateUniqueSlug;

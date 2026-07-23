import { SLUG_MAX_LENGTH } from "../constants";

export const getPostSlug = (title: string) => {
  const stopWords = new Set([
    "a",
    "an",
    "and",
    "are",
    "at",
    "be",
    "been",
    "being",
    "but",
    "by",
    "for",
    "from",
    "in",
    "is",
    "it",
    "of",
    "on",
    "or",
    "that",
    "the",
    "these",
    "this",
    "those",
    "to",
    "was",
    "were",
    "with",
  ]);

  const parsedTitle = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}']+/gu, " ")
    .replace(/'+/g, "'")
    .trim()
    .split(/\s+/g);

  const processedWords = parsedTitle.map((word, index) => {
    if (word === "won't") return index === 0 ? "wont" : "will-not";
    if (word === "it's") return "it-is";
    if (word === "let's") return "let-us";
    if (word.endsWith("s's")) return word.replace("'s", "");
    if (word.endsWith("n't")) return word.replace("n't", "-not");
    if (word.endsWith("'re")) return word.replace("'re", "-are");
    if (word.endsWith("'ll")) return word.replace("'ll", "-will");
    if (word.endsWith("'ve")) return word.replace("'ve", "-have");
    if (word.includes("'")) return word.replace(/'/g, "");

    return word;
  });

  const slugWords = processedWords.join("-");

  if (slugWords.length <= SLUG_MAX_LENGTH) return slugWords;

  const reducedWords = [...processedWords];
  let idx = reducedWords.length - 1;

  while (idx >= 0 && reducedWords.join("-").length > SLUG_MAX_LENGTH) {
    // Only remove if it is a stopWord AND removing it helps length
    if (stopWords.has(reducedWords[idx])) {
      reducedWords.splice(idx, 1);
    }

    idx--;
  }

  // Rebuild slug after selective pruning
  const slug = reducedWords.join("-");

  // If still too long, cut safely at max length (final fallback)
  if (slug.length > SLUG_MAX_LENGTH) {
    let truncated = slug.substring(0, SLUG_MAX_LENGTH);

    // Check if next character is part of a word
    const nextChar = slug.charAt(SLUG_MAX_LENGTH);

    if (/\p{L}|\p{N}/u.test(nextChar)) {
      // Remove any hyphen and partial word at the end
      truncated = truncated.replace(/-+(?:\p{L}|\p{N})*$/u, "");
    }

    return truncated;
  }

  return slug;
};

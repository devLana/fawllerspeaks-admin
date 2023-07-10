import { urls } from "@utils";

const getPostUrl = (slug: string) => {
  const slugged = slug
    .split(/[^a-zÀ-ȕ\d]/gi)
    .filter(Boolean)
    .reduce((result, word, index, arr) => {
      const delim = index === arr.length - 1 ? "" : "-";
      const lowercaseWord = word.toLowerCase();
      const str = `${lowercaseWord}${delim}`;

      return `${result}${str}`;
    }, "");

  return `${urls.siteUrl}/blog/${slugged}`;
};

export default getPostUrl;

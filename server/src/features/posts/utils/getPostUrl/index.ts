import { urls } from "@utils";

const getPostUrl = (title: string) => {
  const slug = title
    .toLowerCase()
    .split(/[\s_-]/g)
    .reduce((result, word, index, arr) => {
      const delimiter = index === arr.length - 1 ? "" : "-";
      const str = `${word}${delimiter}`;

      return `${result}${str}`;
    }, "");

  return { url: `${urls.siteUrl}/blog/${slug}`, slug };
};

export default getPostUrl;

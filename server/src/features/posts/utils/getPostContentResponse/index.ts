import type { PostContent, PostTableOfContents } from "@resolverTypes";

interface Groups {
  level: string | undefined;
  innerHTML: string | undefined;
}

type SorU = string | undefined;
type ReplaceParams = [SorU, SorU, number, string, Groups];

export const getPostContentResponse = (content: string): PostContent => {
  const regex = /<h(?<level>[2-5])>(?<innerHTML>.+?)<\/h\k<level>>/gi;
  const tableContentsArr: PostTableOfContents[] = [];

  const html = content.replace(regex, (match, ...rest: ReplaceParams) => {
    const [, , , , groups] = rest;
    const { level, innerHTML } = groups;

    if (!level || !innerHTML) return match;

    const tagRegex =
      /<\/?[a-z][a-z0-9]*(?:.+?=(['"])(?:(?!\1|\\).|\\.)*\1)*>/gi;
    const textContent = innerHTML.replace(tagRegex, "");

    const id = textContent
      .toLowerCase()
      .replace(/(?:^[^\p{L}\d]+)|(?:[^\p{L}\d]+$)/gu, "")
      .replace(/[^\p{L}\d]+/gu, "-");

    tableContentsArr.push({
      heading: textContent,
      level: +level,
      href: `#${id}`,
    });

    return `<h${level} id="${id}">${innerHTML}</h${level}>`;
  });

  return {
    html,
    tableOfContents: tableContentsArr.length > 0 ? tableContentsArr : null,
  };
};

import type { PostContent, TableOfContents } from "@resolverTypes";

interface Groups {
  level: string | undefined;
  textContent: string | undefined;
}

type SorU = string | undefined;
type ReplaceParams = [SorU, SorU, number, string, Groups];

export const getPostContentResponse = (content: string): PostContent => {
  const regex = /<h(?<level>[2-5])>(?<textContent>.+?)<\/h\k<level>>/gi;
  const tableContentsArr: TableOfContents[] = [];

  const html = content.replace(regex, (match, ...rest: ReplaceParams) => {
    const [, , , , groups] = rest;
    const { level, textContent } = groups;

    if (!level || !textContent) return match;

    const id = textContent
      .toLowerCase()
      .replace(/(?:^[^\p{L}\d]+)|(?:[^\p{L}\d]+$)/gu, "")
      .replace(/[^\p{L}\d]+/gu, "-");

    tableContentsArr.push({
      heading: textContent,
      level: +level,
      href: `#${id}`,
    });

    return `<h${level} id="${id}">${textContent}</h${level}>`;
  });

  return {
    html,
    tableOfContents: tableContentsArr.length > 0 ? tableContentsArr : null,
  };
};

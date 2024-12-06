import * as cheerio from "cheerio";
import type { PostContent, PostTableOfContents } from "@resolverTypes";

export const getPostContentResponse = (content: string): PostContent => {
  const $ = cheerio.load(content, { xml: { xmlMode: true } }, false);
  const toc: PostTableOfContents[] = [];

  $("h2,h3,h4,h5")
    .toArray()
    .forEach(heading => {
      const $h = $(heading);
      const textContent = $h.text().trim();

      if (textContent) {
        const id = textContent
          .toLowerCase()
          .replace(/[^\p{L}\p{N}]+/gu, "-")
          .replace(/^-+|-+$/g, "");

        if (id) {
          $h.attr("id", id);

          toc.push({
            heading: textContent,
            level: +heading.tagName.charAt(1),
            href: `#${id}`,
          });
        }
      }
    });

  return { html: $.html(), tableOfContents: toc.length > 0 ? toc : null };
};

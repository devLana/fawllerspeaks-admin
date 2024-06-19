import { URL } from "node:url";

import { urls } from "@utils/ClientUrls";
import type { PostUrl } from "@resolverTypes";

const getPostUrl = (title: string): PostUrl => {
  const regex = /it's|s's|'s|won't|n't|'\p{L}{1,5}|(?: *[^\p{L}\p{N}]+ *)+/gu;

  const sluggedTitle = title
    .toLowerCase()
    .replace(regex, (match, ...rest: [number, string]) => {
      const [, titleStr] = rest;

      if (match === "it's") return "it-is";
      if (match === "s's" || match === "'s") return "s";

      if (match === "won't") {
        return titleStr.startsWith(match) ? "won-t" : "will-not";
      }

      if (match === "n't") return "-not";

      if (match.includes("'")) {
        if (match.includes("'re")) return "-are";
        if (match.includes("'ll")) return "-will";
        if (match.includes("'ve")) return "-have";

        return "";
      }

      return "-";
    })
    .replace(/(?:^-)|(?:-$)/g, "");

  const { href, pathname } = new URL(sluggedTitle, `${urls.siteUrl}/blog/`);

  return { href, slug: pathname.substring(6) };
};

export default getPostUrl;

import { urls } from "@lib/ClientUrls";
import type { PostUrlResolvers } from "@appTypes/resolverTypes";

export const PostUrl: PostUrlResolvers = {
  href: parent => `${urls.siteUrl}/blog/${parent.href}`,
};

import type { PostUrlResolvers as Resolvers } from "@resolverTypes";
import { urls } from "@utils/ClientUrls";

export const PostUrlResolvers: Resolvers = {
  href: parent => `${urls.siteUrl}/blog/${parent.href}`,
};

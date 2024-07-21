import type { PostUrlResolvers as Resolvers } from "@resolverTypes";
import { urls } from "@utils/ClientUrls";

export const PostUrlResolvers: Resolvers = {
  href: parent => `${urls.siteUrl}/blog/${parent as unknown as string}`,
  slug: parent => parent as unknown as string,
};

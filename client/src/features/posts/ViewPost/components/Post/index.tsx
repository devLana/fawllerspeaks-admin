import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useGetCachedPost } from "../../hooks/useGetCachedPost";
import PostWrapper from "../PostWrapper";
import PostTextContent from "../PostTextContent";
import PostHeader from "./PostHeader";
import PostMetadataList from "./PostMetadataList";
import PostTableOfContents from "./PostTableOfContents";
import PostContentInfo from "./PostContentInfo";
import PostImageBanner from "@features/posts/components/PostImageBanner";
import PostContentView from "@features/posts/components/PostContentView";

const Post = ({ label, slug }: { label: string; slug: string }) => {
  const post = useGetCachedPost(slug);

  if (!post) {
    return (
      <PostTextContent
        label={label}
        severity="error"
        node="There was an error in trying to display this post. Please try again later"
      />
    );
  }

  return (
    <PostWrapper label={label}>
      <PostHeader
        slug={post.url.slug}
        status={post.status}
        title={post.title}
      />
      <Box
        sx={{
          mt: { md: 6 },
          display: { md: "grid" },
          gridTemplateColumns: { md: "1.4fr 2fr" },
          columnGap: { md: 4 },
        }}
      >
        <Box
          component="aside"
          sx={({ breakpoints: { down } }) => ({
            [down("md")]: {
              pb: 2,
              mb: 5,
              borderBottom: "1px solid",
              borderBottomColor: "divider",
            },
            gridRow: { md: 1 },
            gridColumn: { md: 1 },
          })}
        >
          <PostMetadataList
            datePublished={post.datePublished}
            description={post.description}
            lastModified={post.lastModified}
            url={post.url.href}
            views={post.views}
            tags={post.tags}
          />
          {post.content?.tableOfContents && (
            <PostTableOfContents
              tableOfContents={post.content.tableOfContents}
            />
          )}
        </Box>
        <Box
          component="article"
          sx={{ gridRow: { md: 1 }, gridColumn: { md: 2 } }}
        >
          <Typography variant="h1" gutterBottom>
            {post.title}
          </Typography>
          {post.imageBanner && (
            <PostImageBanner src={post.imageBanner} title={post.title} />
          )}
          <PostContentInfo
            name={post.author.name}
            src={post.author.image}
            dateCreated={post.dateCreated}
          />
          {post.content?.html && (
            <PostContentView content={post.content.html} />
          )}
        </Box>
      </Box>
    </PostWrapper>
  );
};

export default Post;

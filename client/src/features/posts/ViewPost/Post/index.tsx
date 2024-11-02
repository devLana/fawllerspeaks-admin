import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import PostWrapper from "../PostWrapper";
import PostHeader from "./PostHeader";
import PostMetadataList from "./PostMetadataList";
import PostTableOfContents from "./PostTableOfContents";
import PostContentHeader from "./PostContentHeader";
import PostImageBanner from "@features/posts/components/PostImageBanner";
import PostContentView from "@features/posts/components/PostContentView";
import type { ModifiedPost } from "types/posts";

const Post = ({ label, post }: { label: string; post: ModifiedPost }) => (
  <PostWrapper label={label}>
    <PostHeader slug={post.url.slug} status={post.status} title={post.title} />
    <Typography variant="h1" align="center" gutterBottom>
      {post.title}
    </Typography>
    <Box
      sx={{
        display: { md: "grid" },
        gridTemplateColumns: { md: "1fr 2fr" },
        columnGap: { md: 4 },
      }}
    >
      <Box
        component="aside"
        sx={({ breakpoints: { down } }) => ({
          [down("md")]: {
            pb: 3,
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
          <PostTableOfContents tableOfContents={post.content.tableOfContents} />
        )}
      </Box>
      <Box
        component="article"
        sx={{ gridRow: { md: 1 }, gridColumn: { md: 2 } }}
      >
        {post.imageBanner && (
          <PostImageBanner
            src={post.imageBanner}
            alt={`${post.title} image banner`}
            sx={{
              height: { height: 200, sm: 250, md: 300 },
              borderRadius: 1,
              overflow: "hidden",
              mb: 3,
            }}
          />
        )}
        <PostContentHeader
          name={post.author.name}
          src={post.author.image}
          dateCreated={post.dateCreated}
        />
        {post.content?.html && <PostContentView content={post.content.html} />}
      </Box>
    </Box>
  </PostWrapper>
);

export default Post;

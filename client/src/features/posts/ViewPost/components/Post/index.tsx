import { useRouter } from "next/router";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { InfoOutlined } from "@mui/icons-material";

import ViewPostWrapper from "../ViewPostWrapper";
import PostMetadataList from "./PostMetadataList";
import PostTableOfContents from "./PostTableOfContents";
import PostContentHeader from "./PostContentHeader";
import PostActions from "./PostActions";
import PostDate from "@features/posts/components/PostDate";
import PostImageBanner from "@features/posts/components/PostImageBanner";
import PostContentView from "@features/posts/components/PostContentView";
import PostViewHeader from "@features/posts/components/PostViewHeader";
import type { PostData } from "types/posts";

const Post = ({ label, post }: { label: string; post: PostData }) => {
  const { back } = useRouter();

  return (
    <ViewPostWrapper label={label}>
      <PostViewHeader
        buttonLabel="Go back to posts page"
        onClick={() => back()}
        status={post.status}
        title={post.title}
        status_menu_sx={
          post.isBinned
            ? { px: 1 }
            : { pl: 1, display: "flex", alignItems: "center", columnGap: 2 }
        }
      >
        {post.isBinned ? null : (
          <PostActions
            id={post.id}
            title={post.title}
            status={post.status}
            slug={post.url.slug}
            menuSx={{ bgcolor: "action.selected" }}
          />
        )}
      </PostViewHeader>
      <Box
        sx={{
          display: { md: "grid" },
          gridTemplateColumns: { md: "1fr 2fr" },
          columnGap: { md: 5 },
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
            description={post.description}
            excerpt={post.excerpt}
            datePublished={post.datePublished}
            lastModified={post.lastModified}
            url={post.url}
            views={post.views}
            tags={post.tags}
          />
          {post.content?.tableOfContents &&
            post.content.tableOfContents.length > 0 && (
              <PostTableOfContents
                tableOfContents={post.content.tableOfContents}
              />
            )}
        </Box>
        <Box
          component="article"
          sx={{ gridRow: { md: 1 }, gridColumn: { md: 2 } }}
        >
          {post.isBinned && post.binnedAt && (
            <Alert
              role="status"
              severity="info"
              icon={<InfoOutlined />}
              sx={{ mb: 6 }}
            >
              This post was binned on <PostDate dateString={post.binnedAt} />.
              It is now read-only
            </Alert>
          )}
          <Typography variant="h1" gutterBottom>
            {post.title}
          </Typography>
          {post.imageBanner && (
            <PostImageBanner
              src={post.imageBanner}
              alt={`${post.title} image banner`}
              sizes="(max-width: 600px) 570px, (max-width: 900px) 750px, 680px"
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
          {post.content?.html && (
            <PostContentView content={post.content.html} />
          )}
        </Box>
      </Box>
    </ViewPostWrapper>
  );
};

export default Post;

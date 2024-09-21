import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import PostContentView from "@features/posts/components/PostContentView";
import PostImageBanner from "@features/posts/components/PostImageBanner";

interface ArticleProps {
  content: string;
  imageBannerBlobUrl: string | undefined;
  title: string;
}

const Article = ({ content, imageBannerBlobUrl, title }: ArticleProps) => (
  <Box
    component="article"
    sx={({ breakpoints: { down } }) => ({
      [down("md")]: { mb: 5 },
      pb: 5,
      borderBottom: "1px solid",
      borderColor: "divider",
      gridArea: { md: "1 / 2 / 2 / 3" },
    })}
  >
    <Typography
      variant="h2"
      gutterBottom
      sx={({ typography }) => ({ ...typography.h1 })}
    >
      {title}
    </Typography>
    {imageBannerBlobUrl && (
      <PostImageBanner
        src={imageBannerBlobUrl}
        alt={`${title} image banner`}
        sx={{
          height: { height: 200, sm: 250, md: 300 },
          maxWidth: 700,
          borderRadius: 1,
          overflow: "hidden",
          mb: 3,
          mx: "auto",
        }}
      />
    )}
    <PostContentView content={content} />
  </Box>
);

export default Article;

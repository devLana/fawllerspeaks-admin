import Box from "@mui/material/Box";

import Article from "@features/posts/components/PostPreview/Article";
import Aside from "@features/posts/components/PostPreview/Aside";

interface PostPreviewProps {
  title: string;
  description: string;
  excerpt: string;
  content: string;
  tagIds: string[] | undefined;
  imageSrc: string | null;
  imageSizes?: string;
  children: React.ReactElement;
}

const PostPreview = ({
  title,
  description,
  excerpt,
  content,
  tagIds,
  imageSrc,
  imageSizes,
  children,
}: PostPreviewProps) => (
  <Box
    sx={{
      display: { md: "grid" },
      gridTemplateColumns: { md: "1.2fr 2fr" },
      gridTemplateRows: { md: "auto auto" },
      columnGap: { md: 4 },
      rowGap: { md: 5 },
    }}
  >
    <Aside description={description} excerpt={excerpt} tagIds={tagIds} />
    <Article
      title={title}
      imageSrc={imageSrc}
      content={content}
      sizes={imageSizes}
    />
    {children}
  </Box>
);

export default PostPreview;

import Image from "next/image";
import Box from "@mui/material/Box";

interface PostImageBannerPreviewProps {
  imageBanner: string | undefined;
  title: string;
}

const PostImageBannerPreview = (props: PostImageBannerPreviewProps) => {
  const { imageBanner, title } = props;

  if (!imageBanner) return null;

  return (
    <Box
      position="relative"
      height={{ height: 200, sm: 250, md: 300 }}
      maxWidth={700}
      borderRadius={1}
      overflow="hidden"
      mb={3}
      mx="auto"
    >
      <Image
        src={imageBanner}
        alt={`Image banner for: "${title}"`}
        style={{ objectFit: "cover" }}
        fill
      />
    </Box>
  );
};

export default PostImageBannerPreview;

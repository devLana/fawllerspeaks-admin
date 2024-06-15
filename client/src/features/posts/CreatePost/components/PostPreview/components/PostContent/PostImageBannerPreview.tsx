import Image from "next/image";
import Box from "@mui/material/Box";

interface PostImageBannerPreviewProps {
  imageBanner: string | undefined;
  title: string;
}

const PostImageBannerPreview = (props: PostImageBannerPreviewProps) => {
  const { imageBanner, title } = props;

  return (
    <>
      {imageBanner ? (
        <Box
          position="relative"
          width="100%"
          height={{ height: 200, sm: 250, md: 320 }}
          maxWidth={700}
          borderRadius={1}
          overflow="hidden"
          mb={3}
        >
          <Image
            src={imageBanner}
            alt={`Image banner for: "${title}"`}
            style={{ objectFit: "cover" }}
            fill
          />
        </Box>
      ) : null}
    </>
  );
};

export default PostImageBannerPreview;

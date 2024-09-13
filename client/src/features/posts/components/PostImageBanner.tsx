import Image from "next/image";
import Box, { type BoxProps } from "@mui/material/Box";
import type { SxPropsArray } from "@types";

interface PostImageBannerProps {
  src: string;
  title: string;
  sx?: BoxProps["sx"];
}

const PostImageBanner = ({ src, sx = [], title }: PostImageBannerProps) => {
  const sxProps: SxPropsArray = Array.isArray(sx) ? sx : [sx];

  return (
    <Box sx={[{ position: "relative" }, ...sxProps]}>
      <Image
        src={src}
        alt={`Image banner for ${title}`}
        fill
        style={{ objectFit: "cover" }}
        priority
      />
    </Box>
  );
};

export default PostImageBanner;

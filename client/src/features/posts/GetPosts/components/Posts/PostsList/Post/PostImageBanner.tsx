import Box from "@mui/material/Box";

const PostImageBanner = ({ imageLink }: { imageLink: string }) => (
  <Box
    sx={{
      // mb: 2,
      border: "1px solid",
      borderColor: "divider",
      height: { height: 200, sm: 280 },
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      bgcolor: "action.disabledBackground",
    }}
  >
    Image Banner {imageLink}
  </Box>
);

export default PostImageBanner;

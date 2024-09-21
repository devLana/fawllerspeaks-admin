import Chip from "@mui/material/Chip";

import { postStatusColors } from "@utils/posts/postStatusColors";
import type { PostStatus as Status } from "@apiTypes";

const PostStatus = ({ status }: { status: Status }) => (
  <Chip
    label={status}
    size="small"
    sx={{
      position: "absolute",
      top: "5px",
      right: "5px",
      fontWeight: "bold",
      letterSpacing: 0.5,
      color: ({ appTheme }) => postStatusColors(status, appTheme.themeMode),
    }}
  />
);

export default PostStatus;

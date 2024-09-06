import Chip from "@mui/material/Chip";

import { postStatusBgColors } from "../utils/postStatusBgColors";
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
      color({ appTheme: { themeMode } }) {
        return postStatusBgColors(status, themeMode);
      },
    }}
  />
);

export default PostStatus;

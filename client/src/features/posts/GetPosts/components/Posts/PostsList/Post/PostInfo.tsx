import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { formatPostDate } from "../utils/formatPostDate";

interface PostInfoProps {
  title: string;
  dateCreated: string;
}

const PostInfo = ({ title, dateCreated }: PostInfoProps) => (
  <Box sx={{ px: 2 }}>
    <Typography variant="h2" gutterBottom textAlign="center" fontSize="1.25em">
      {title}
    </Typography>
    <Typography variant="body2" textAlign="center">
      Created on&nbsp;
      <time dateTime={dateCreated}>{formatPostDate(dateCreated)}</time>
    </Typography>
  </Box>
);

export default PostInfo;

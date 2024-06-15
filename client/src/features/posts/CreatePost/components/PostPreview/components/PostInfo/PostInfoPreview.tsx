import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import FormatQuoteOutlinedIcon from "@mui/icons-material/FormatQuoteOutlined";
import LinkIcon from "@mui/icons-material/Link";

interface PostInfoProps {
  title: string;
  description: string;
  excerpt: string;
}

const PostInfoPreview = ({ description, excerpt, title }: PostInfoProps) => {
  const regex = /(?:(?: *#+ *)+|(?: *_+ *)+|(?: *\.+ *)+| +)/g;
  const formattedTitle = title.trim().toLowerCase().replace(regex, "-");
  const { href } = new URL(formattedTitle, "https://fawllerspeaks.com/blog/");

  return (
    <List
      sx={{
        wordBreak: "break-word",
        "& :not(:last-child)": { hyphens: "auto" },
      }}
    >
      <ListItem disableGutters>
        <ListItemIcon>
          <ArticleOutlinedIcon sx={{ color: "text.primary" }} />
        </ListItemIcon>
        <ListItemText primary={description} />
      </ListItem>
      <ListItem disableGutters>
        <ListItemIcon>
          <FormatQuoteOutlinedIcon sx={{ color: "text.primary" }} />
        </ListItemIcon>
        <ListItemText primary={excerpt} />
      </ListItem>
      <ListItem disableGutters>
        <ListItemIcon>
          <LinkIcon sx={{ color: "text.primary" }} />
        </ListItemIcon>
        <ListItemText primary={href} />
      </ListItem>
    </List>
  );
};

export default PostInfoPreview;

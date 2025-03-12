import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import PostsPageBackButton from "@features/posts/components/PostsPageBackButton";

interface CreatePostSectionHeaderProps {
  onClick: VoidFunction;
  id: string;
  buttonLabel: string;
  heading: string;
  actionsMenu?: React.ReactElement;
}

const CreatePostSectionHeader = (props: CreatePostSectionHeaderProps) => {
  const { onClick, heading, buttonLabel, id, actionsMenu } = props;

  return (
    <Box sx={{ mb: 2.5, display: "flex", columnGap: 3 }}>
      <PostsPageBackButton buttonLabel={buttonLabel} onClick={onClick} />
      <Typography variant="h2" id={id}>
        {heading}
      </Typography>
      {actionsMenu}
    </Box>
  );
};

export default CreatePostSectionHeader;

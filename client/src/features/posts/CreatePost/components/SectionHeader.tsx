import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import PostsPageBackButton from "@features/posts/components/PostsPageBackButton";

interface SectionHeaderProps {
  onClick: VoidFunction;
  id: string;
  buttonLabel: string;
  heading: string;
  actionsMenu?: React.ReactElement;
}

const SectionHeader = (props: SectionHeaderProps) => {
  const { onClick, heading, buttonLabel, id, actionsMenu } = props;

  return (
    <Box mb={3} display="flex" alignItems="flex-start" columnGap={3}>
      <PostsPageBackButton buttonLabel={buttonLabel} onClick={onClick} />
      <Typography variant="h2" id={id}>
        {heading}
      </Typography>
      {actionsMenu}
    </Box>
  );
};

export default SectionHeader;

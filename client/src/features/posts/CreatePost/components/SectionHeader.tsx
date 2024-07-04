import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ChevronLeft from "@mui/icons-material/ChevronLeft";

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
      <Tooltip title={buttonLabel}>
        <IconButton color="secondary" size="small" onClick={onClick}>
          <ChevronLeft fontSize="small" />
        </IconButton>
      </Tooltip>
      <Typography variant="h2" id={id}>
        {heading}
      </Typography>
      {actionsMenu}
    </Box>
  );
};

export default SectionHeader;

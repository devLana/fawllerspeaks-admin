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
}

const SectionHeader = (props: SectionHeaderProps) => {
  const { onClick, heading, buttonLabel, id } = props;

  return (
    <Box mb={1.5} display="flex" alignItems="center" columnGap={3}>
      <Tooltip title={buttonLabel}>
        <IconButton color="primary" onClick={onClick}>
          <ChevronLeft fontSize="small" />
        </IconButton>
      </Tooltip>
      <Typography variant="h2" id={id}>
        {heading}
      </Typography>
    </Box>
  );
};

export default SectionHeader;

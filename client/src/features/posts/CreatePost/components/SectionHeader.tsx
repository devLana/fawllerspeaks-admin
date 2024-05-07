import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ChevronLeft from "@mui/icons-material/ChevronLeft";

interface SectionHeaderProps {
  onClick: VoidFunction;
  label: string;
  heading: string;
}

const SectionHeader = ({ onClick, heading, label }: SectionHeaderProps) => (
  <Box mb={1.5} display="flex" alignItems="center" columnGap={3}>
    <IconButton color="primary" aria-label={label} onClick={onClick}>
      <ChevronLeft fontSize="small" />
    </IconButton>
    <Typography variant="h2">{heading}</Typography>
  </Box>
);

export default SectionHeader;

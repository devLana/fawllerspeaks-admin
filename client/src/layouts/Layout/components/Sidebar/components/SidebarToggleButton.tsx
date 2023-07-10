import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

interface SidebarToggleButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SidebarToggleButton = (props: SidebarToggleButtonProps) => {
  const { isOpen, onToggle } = props;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        px: { xs: 3.2, sm: isOpen ? 3.2 : 1 },
        py: 2,
        mb: 2,
        mr: { sm: isOpen ? 0 : 0.5 },
      }}
    >
      <IconButton
        aria-label="Toggle sidebar"
        onClick={onToggle}
        sx={{ transform: { sm: isOpen ? "rotate(0deg)" : "rotate(180deg)" } }}
      >
        <ChevronLeftIcon />
      </IconButton>
    </Box>
  );
};

export default SidebarToggleButton;

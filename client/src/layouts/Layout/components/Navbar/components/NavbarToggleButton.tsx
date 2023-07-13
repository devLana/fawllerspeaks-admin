import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

interface NavbarToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const NavbarToggleButton = ({ isOpen, onClick }: NavbarToggleButtonProps) => (
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
      aria-label="Toggle navbar"
      onClick={onClick}
      sx={{ transform: { sm: isOpen ? "rotate(0deg)" : "rotate(180deg)" } }}
    >
      <ChevronLeftIcon />
    </IconButton>
  </Box>
);

export default NavbarToggleButton;

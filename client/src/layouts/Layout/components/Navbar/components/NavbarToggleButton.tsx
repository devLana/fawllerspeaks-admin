import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

interface NavbarToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const NavbarToggleButton = ({ isOpen, onClick }: NavbarToggleButtonProps) => (
  <Box
    sx={{ display: "flex", justifyContent: "flex-end", mt: 3, mb: 2, mr: 3 }}
  >
    <IconButton
      aria-label="Toggle navbar"
      onClick={onClick}
      sx={{
        color: ({ appTheme }) => {
          return appTheme === "sunny" ? "primary.dark" : "primary.main";
        },
        transform: { sm: isOpen ? "rotate(0deg)" : "rotate(180deg)" },
      }}
    >
      <ChevronLeftIcon />
    </IconButton>
  </Box>
);

export default NavbarToggleButton;

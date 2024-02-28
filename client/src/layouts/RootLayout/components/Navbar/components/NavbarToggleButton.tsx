import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

interface NavbarToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const NavbarToggleButton = ({ isOpen, onClick }: NavbarToggleButtonProps) => (
  <Box display="flex" m={3} mt={{ sm: 0 }} ml={{ sm: 0 }}>
    <IconButton
      aria-label="Toggle navbar"
      onClick={onClick}
      sx={{
        m: "auto",
        color: ({ appTheme: { themeMode } }) => {
          return themeMode === "sunny" ? "primary.dark" : "primary.main";
        },
        transform: {
          sm: isOpen ? "rotate(0deg)" : "rotate(180deg)",
          md: isOpen ? "rotate(180deg)" : "rotate(0deg)",
        },
      }}
    >
      <ChevronLeftIcon />
    </IconButton>
  </Box>
);

export default NavbarToggleButton;

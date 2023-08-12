import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

interface NavbarToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const NavbarToggleButton = ({ isOpen, onClick }: NavbarToggleButtonProps) => (
  <Box
    sx={theme => ({
      display: "flex",
      m: 3,
      [theme.breakpoints.up("sm")]: { ml: 0, mt: 0 },
    })}
  >
    <IconButton
      aria-label="Toggle navbar"
      onClick={onClick}
      sx={{
        m: "auto",
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

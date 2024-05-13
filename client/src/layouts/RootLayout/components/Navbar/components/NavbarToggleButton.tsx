import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

interface NavbarToggleButtonProps {
  isOpen: boolean;
  sm_Above: boolean;
  onClick: () => void;
}

const NavbarToggleButton = (props: NavbarToggleButtonProps) => {
  const { isOpen, sm_Above, onClick } = props;

  const text = "main sidebar navigation";
  let title: string;

  if (sm_Above) {
    title = isOpen ? `Minimize ${text}` : `Maximize ${text}`;
  } else {
    title = `Hide ${text}`;
  }

  return (
    <Box display="flex" m={3} mt={{ sm: 0 }} ml={{ sm: 0 }}>
      <Tooltip title={title}>
        <IconButton
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
      </Tooltip>
    </Box>
  );
};

export default NavbarToggleButton;

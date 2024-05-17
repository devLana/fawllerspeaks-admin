import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
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
    <ListItem sx={{ pb: 2, px: 0, borderBottom: 1, borderColor: "divider" }}>
      <Tooltip title={title} placement="bottom-start">
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
    </ListItem>
  );
};

export default NavbarToggleButton;

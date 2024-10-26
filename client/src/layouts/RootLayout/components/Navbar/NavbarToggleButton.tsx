import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import Tooltip from "@mui/material/Tooltip";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

interface NavbarToggleButtonProps {
  isOpen: boolean;
  sm_Above: boolean;
  md_Above: boolean;
  onClick: () => void;
}

const NavbarToggleButton = (props: NavbarToggleButtonProps) => {
  const { isOpen, sm_Above, md_Above, onClick } = props;

  const text = "main app navigation";
  let title: string;
  let label: string;

  if (md_Above) {
    title = isOpen ? `Maximize ${text}` : `Minimize ${text}`;
    label = "Toggle main app navigation size";
  } else if (sm_Above) {
    title = isOpen ? `Minimize ${text}` : `Maximize ${text}`;
    label = "Toggle main app navigation size";
  } else {
    title = `Hide ${text}`;
    label = title;
  }

  return (
    <ListItem
      aria-label={label}
      disablePadding
      sx={{ pb: 2, borderBottom: 1, borderColor: "divider" }}
    >
      <Tooltip title={title} placement="bottom-start">
        <IconButton
          onClick={onClick}
          sx={{
            m: "auto",
            color({ appTheme: { themeMode } }) {
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

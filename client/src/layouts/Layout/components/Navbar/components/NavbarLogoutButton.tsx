import * as React from "react";

import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";

import Toast from "@components/Toast";
import LogoutModal from "./LogoutModal";
import transition from "@layouts/Layout/components/Navbar/utils/transition";
import type { MuiIconType } from "@types";

interface NavbarLogoutButtonProps {
  label: string;
  Icon: MuiIconType;
  isOpen: boolean;
  smMatches: boolean;
}

const NavbarLogoutButton = (props: NavbarLogoutButtonProps) => {
  const { Icon, label, isOpen, smMatches } = props;

  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const handleCloseModal = () => setModalIsOpen(false);

  const handleToast = (msg: string) => {
    setModalIsOpen(false);
    setToastMessage(msg);
  };

  return (
    <>
      <Tooltip title={!isOpen && smMatches ? label : null} placement="right">
        <ListItem
          sx={{
            py: 1,
            px: 3,
            pl: { sm: 0 },
            transition: theme => ({ sm: transition(theme, isOpen, "padding") }),
          }}
        >
          <ListItemButton
            sx={theme => ({
              borderRadius: 1,
              transition: transition(theme, isOpen, [
                "background-color",
                "padding",
              ]),
              "&:hover": { bgcolor: "action.hover" },
              [theme.breakpoints.up("sm")]: {
                px: isOpen ? 2 : 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
              },
            })}
            component={Button}
            onClick={() => setModalIsOpen(true)}
            aria-haspopup="dialog"
            aria-controls={modalIsOpen ? "logout-dialog" : undefined}
            aria-expanded={modalIsOpen || undefined}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={label} sx={{ m: 0 }} />
          </ListItemButton>
        </ListItem>
      </Tooltip>
      {modalIsOpen && (
        <LogoutModal
          isOpen={modalIsOpen}
          onClick={handleCloseModal}
          onApiError={handleToast}
        />
      )}
      {toastMessage && (
        <Toast
          horizontal="center"
          vertical="bottom"
          isOpen={!!toastMessage}
          onClose={() => setToastMessage(null)}
          direction="up"
          severity="error"
          content={toastMessage}
        />
      )}
    </>
  );
};

export default NavbarLogoutButton;

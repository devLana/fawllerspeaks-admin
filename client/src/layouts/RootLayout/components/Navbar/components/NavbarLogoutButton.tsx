import * as React from "react";

import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Snackbar from "@mui/material/Snackbar";

import LogoutModal from "./LogoutModal";
import { NavbarTooltip } from "./NavbarTooltip";
import transition from "../utils/transition";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import type { MuiIconType } from "@types";

interface NavbarLogoutButtonProps {
  label: string;
  Icon: MuiIconType;
  isOpen: boolean;
}

const NavbarLogoutButton = (props: NavbarLogoutButtonProps) => {
  const { Icon, label, isOpen } = props;

  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");
  const [alertIsOpen, setAlertIsOpen] = React.useState(false);

  const handleCloseModal = () => setModalIsOpen(false);

  const handleToast = (msg: string) => {
    setModalIsOpen(false);
    setToastMessage(msg);
    setAlertIsOpen(true);
  };

  return (
    <>
      <NavbarTooltip isOpen={isOpen} title={label} placement="right">
        <ListItem sx={{ py: 1, px: 3, pl: { sm: 0 } }}>
          <ListItemButton
            sx={{
              px: 1.5,
              borderRadius: 1,
              flexGrow: { sm: 0 },
              whiteSpace: { sm: "nowrap" },
              overflow: { sm: "hidden" },
              transition: theme => {
                return transition(theme.transitions, isOpen, [
                  "background-color",
                  "padding",
                ]);
              },
              "&:hover": { bgcolor: "action.hover" },
            }}
            component={Button}
            onClick={() => setModalIsOpen(true)}
            aria-haspopup="dialog"
            aria-controls={modalIsOpen ? "logout-dialog" : undefined}
            aria-expanded={modalIsOpen || undefined}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 0 }}>
              <Icon />
            </ListItemIcon>
            <ListItemText
              primary={label}
              sx={{
                my: 0,
                marginLeft: 2,
                ml: { sm: isOpen ? 2 : 0, md: isOpen ? 0 : 2 },
                opacity: { sm: isOpen ? 1 : 0, md: isOpen ? 0 : 1 },
                transition: ({ transitions: transit }) => {
                  return transition(transit, isOpen, [
                    "margin-left",
                    "opacity",
                  ]);
                },
                "&>.MuiTypography-root": { lineHeight: 1 },
              }}
            />
          </ListItemButton>
        </ListItem>
      </NavbarTooltip>
      <Snackbar
        message={toastMessage}
        open={alertIsOpen}
        onClose={handleCloseAlert<boolean>(false, setAlertIsOpen)}
      />
      {modalIsOpen && (
        <LogoutModal
          isOpen={modalIsOpen}
          onClick={handleCloseModal}
          onApiError={handleToast}
        />
      )}
    </>
  );
};

export default NavbarLogoutButton;

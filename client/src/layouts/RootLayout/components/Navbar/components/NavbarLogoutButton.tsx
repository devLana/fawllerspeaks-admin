import * as React from "react";

import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Snackbar from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";

import LogoutModal from "./LogoutModal";
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
      <Tooltip title={isOpen ? null : label} placement="right">
        <ListItem sx={{ py: 1, px: 3, pl: { sm: 0 } }}>
          <ListItemButton
            sx={theme => ({
              px: 1.5,
              borderRadius: 1,
              transition: transition(theme, isOpen, [
                "background-color",
                "padding",
              ]),
              "&:hover": { bgcolor: "action.hover" },
              [theme.breakpoints.up("sm")]: {
                flexGrow: 0,
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
            <ListItemIcon sx={{ color: "inherit", minWidth: 0 }}>
              <Icon />
            </ListItemIcon>
            <ListItemText
              primary={label}
              sx={theme => ({
                ml: 1,
                my: 0,
                transition: transition(theme, isOpen, [
                  "margin-left",
                  "opacity",
                ]),
                "&>.MuiTypography-root": { lineHeight: 1 },
                [theme.breakpoints.up("sm")]: {
                  ...(isOpen ? { ml: 1, opacity: 1 } : { ml: 0, opacity: 0 }),
                },
              })}
            />
          </ListItemButton>
        </ListItem>
      </Tooltip>
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

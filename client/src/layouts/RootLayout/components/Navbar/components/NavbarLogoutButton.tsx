import * as React from "react";

import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";

import LogoutModal from "./LogoutModal";
import transition from "../utils/transition";
import type { MuiIconType } from "@types";

interface NavbarLogoutButtonProps {
  label: string;
  Icon: MuiIconType;
  isOpen: boolean;
  showTooltip: boolean;
}

const NavbarLogoutButton = (props: NavbarLogoutButtonProps) => {
  const { Icon, label, isOpen, showTooltip } = props;
  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  return (
    <>
      <Tooltip title={showTooltip ? label : null} placement="right">
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
      </Tooltip>
      <LogoutModal
        isOpen={modalIsOpen}
        onCloseModal={() => setModalIsOpen(false)}
      />
    </>
  );
};

export default NavbarLogoutButton;

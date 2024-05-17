import * as React from "react";

import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";

import LogoutModal from "./LogoutModal";
import transition from "../utils/transition";
import type { NavbarButtonItem } from "@types";

interface NavbarItemButtonProps extends NavbarButtonItem {
  isOpen: boolean;
  showTooltip: boolean;
}

const NavbarItemButton = (props: NavbarItemButtonProps) => {
  const { label, Icon, isOpen, showTooltip } = props;
  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  return (
    <>
      <ListItem sx={{ py: 2, px: 0 }}>
        <Tooltip title={showTooltip ? label : null} placement="right">
          <ListItemButton
            sx={{
              px: 1.5,
              borderRadius: 1,
              color: "primary.main",
              flexGrow: { sm: 0 },
              whiteSpace: { sm: "nowrap" },
              overflow: { sm: "hidden" },
              transition: theme => {
                return transition(theme.transitions, isOpen, [
                  "background-color",
                  "padding",
                ]);
              },
              "&:hover": { color: "primary.main" },
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
        </Tooltip>
      </ListItem>
      <LogoutModal
        isOpen={modalIsOpen}
        onCloseModal={() => setModalIsOpen(false)}
      />
    </>
  );
};

export default NavbarItemButton;

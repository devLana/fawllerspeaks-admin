import { useMutation } from "@apollo/client/react";
import Button from "@mui/material/Button";
import DialogContentText from "@mui/material/DialogContentText";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";

import { useDialog } from "@hooks/common/useDialog";
import { useLogout } from "@hooks/auth/logout/useLogout";
import { LOGOUT } from "@mutations/auth/logout";
import transition from "@utils/layouts/transition";
import type { NavbarButtonItem } from "@appTypes/layouts/navbar";

interface NavbarLogoutButtonProps extends NavbarButtonItem {
  isOpen: boolean;
  isLoading: boolean;
  showTooltip: boolean;
}

const logoutDialogContent = (
  <DialogContentText id="log-out-description">
    Log out of your current session. You will need to log in again to continue
    using the dashboard
  </DialogContentText>
);

const NavbarLogoutButton = (props: NavbarLogoutButtonProps) => {
  const { label, Icon, isOpen, isLoading, showTooltip } = props;
  const [logout] = useMutation(LOGOUT);

  const dialog = useDialog();
  const { onCompleted, onError } = useLogout();

  return isLoading ? (
    <ListItem disablePadding aria-live="polite" aria-busy={true}>
      <Skeleton
        variant="rounded"
        aria-label="Loading logout button"
        height={40}
        width={152}
      />
    </ListItem>
  ) : (
    <ListItem disablePadding aria-live="polite" aria-busy={false}>
      <Tooltip title={showTooltip ? label : null} placement="right">
        <ListItemButton
          component={Button}
          aria-haspopup="dialog"
          nativeButton
          sx={{
            px: 1.5,
            borderRadius: 1,
            color: "primary.main",
            flexGrow: { sm: 0 },
            whiteSpace: { sm: "nowrap" },
            overflow: { sm: "hidden" },
            transition({ transitions: t }) {
              return transition(t, isOpen, ["background-color", "padding"]);
            },
            "&:hover": { color: "primary.main" },
          }}
          onClick={() => {
            dialog({
              role: "alertdialog",
              ariaDescribedBy: "log-out-description",
              title: "Logout",
              confirmText: "Logout",
              contentDividers: true,
              content: logoutDialogContent,
              onConfirm(callback) {
                void logout({ onCompleted, onError: onError(callback) });
              },
            });
          }}
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
              transition({ transitions: tran }) {
                return transition(tran, isOpen, ["margin-left", "opacity"]);
              },
              "&>.MuiTypography-root": { lineHeight: 1 },
            }}
          />
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
};

export default NavbarLogoutButton;

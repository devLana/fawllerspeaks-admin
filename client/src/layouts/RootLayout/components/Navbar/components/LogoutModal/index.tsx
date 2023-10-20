import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "@mui/lab/LoadingButton";

import { useSession } from "@context/SessionContext";
import { SESSION_ID } from "@utils/constants";
import { LOGOUT } from "./LOGOUT";

interface LogoutModalProps {
  isOpen: boolean;
  onClick: () => void;
  onApiError: (msg: string) => void;
}

const msg = "You are unable to logout at the moment. Please try again later";

const LogoutModal = ({ isOpen, onClick, onApiError }: LogoutModalProps) => {
  const [status, setStatus] = React.useState<"idle" | "loading">("idle");

  const { replace } = useRouter();

  const [logout, { client }] = useMutation(LOGOUT);

  const { handleClearRefreshTokenTimer } = useSession();

  const handleLogout = async () => {
    const sessionId = localStorage.getItem(SESSION_ID);

    if (sessionId) {
      setStatus("loading");

      const { data: response } = await logout({
        variables: { sessionId },
        onError: err => onApiError(err.graphQLErrors[0]?.message ?? msg),
      });

      if (response) {
        switch (response.logout.__typename) {
          case "SessionIdValidationError":
            onApiError(response.logout.sessionIdError);
            break;

          case "UnknownError":
            onApiError("The current session could not be verified");
            break;

          case "NotAllowedError":
            onApiError("You cannot perform that action right now");
            break;

          case "AuthenticationError":
            handleClearRefreshTokenTimer();
            void client.clearStore();
            void replace("/login?status=unauthenticated");
            break;

          case "Response":
            localStorage.removeItem(SESSION_ID);
            handleClearRefreshTokenTimer();
            void client.clearStore();
            void replace("/login");
            break;

          default:
            onApiError(msg);
        }
      }
    }
  };

  return (
    <Dialog open={isOpen} aria-labelledby="logout-dialog-title">
      <DialogTitle id="logout-dialog-title" sx={{ textAlign: "center" }}>
        Logout of your account
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ textAlign: "center" }}>
          Do you want to logout of FawllerSpeaks Admin?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button disabled={status === "loading"} onClick={onClick}>
          Cancel
        </Button>
        <LoadingButton
          onClick={handleLogout}
          loading={status === "loading"}
          variant="contained"
        >
          <span>Logout</span>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutModal;

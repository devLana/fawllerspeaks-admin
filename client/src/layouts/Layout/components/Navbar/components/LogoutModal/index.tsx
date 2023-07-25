import * as React from "react";
import { useRouter } from "next/router";

import { useApolloClient, useMutation } from "@apollo/client";
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
  const [status, setStatus] = React.useState<"idle" | "requesting">("idle");

  const { replace } = useRouter();

  const client = useApolloClient();
  const [logout] = useMutation(LOGOUT, {
    onError(err) {
      const message = err.graphQLErrors[0] ? err.graphQLErrors[0].message : msg;
      onApiError(message);
    },
  });

  const { handleClearRefreshTokenTimer } = useSession();

  const handleLogout = async () => {
    const sessionId = localStorage.getItem(SESSION_ID);

    if (sessionId) {
      setStatus("requesting");

      const { data: response } = await logout({ variables: { sessionId } });

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
            localStorage.removeItem(SESSION_ID);
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
    <Dialog
      open={isOpen}
      PaperProps={{ id: "logout-dialog" }}
      aria-describedby="logout-dialog-description"
      aria-labelledby="logout-dialog-title"
    >
      <DialogTitle id="logout-dialog-title" sx={{ textAlign: "center" }}>
        Logout of your account
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="logout-dialog-description"
          sx={{ textAlign: "center" }}
        >
          Do you want to logout of FawllerSpeaks Admin?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <LoadingButton
          onClick={handleLogout}
          loading={status === "requesting"}
          variant="contained"
        >
          <span>Logout</span>
        </LoadingButton>
        <Button disabled={status === "requesting"} onClick={onClick}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutModal;

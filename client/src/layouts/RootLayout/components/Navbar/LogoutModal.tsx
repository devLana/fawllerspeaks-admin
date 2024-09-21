import { useMutation } from "@apollo/client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import LoadingButton from "@mui/lab/LoadingButton";

import { LOGOUT } from "@mutations/logout/LOGOUT";
import { SESSION_ID } from "@utils/constants";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import type { Status } from "@types";
import useLogout from "@hooks/logout/useLogout";

interface LogoutModalProps {
  isOpen: boolean;
  onCloseModal: () => void;
}

const LogoutModal = ({ isOpen, onCloseModal }: LogoutModalProps) => {
  const [logout, { data, error }] = useMutation(LOGOUT);

  const { onCompleted, setStatus, status } = useLogout(onCloseModal);

  const handleLogout = () => {
    const sessionId = localStorage.getItem(SESSION_ID);

    if (!sessionId) {
      setStatus("error");
      onCloseModal();
      return;
    }

    setStatus("loading");

    void logout({
      variables: { sessionId },
      onError: () => {
        onCloseModal();
        setStatus("error");
      },
      onCompleted,
    });
  };

  let alertMessage =
    "You are unable to logout at the moment. Please try again later";

  if (error?.graphQLErrors?.[0]) {
    alertMessage = error.graphQLErrors[0].message;
  } else if (data?.logout.__typename === "NotAllowedError") {
    alertMessage = "You cannot perform that action right now";
  } else if (data?.logout.__typename === "UnknownError") {
    alertMessage = "The current session could not be verified";
  } else if (data?.logout.__typename === "SessionIdValidationError") {
    alertMessage = data.logout.sessionIdError;
  }

  return (
    <>
      <Snackbar
        message={alertMessage}
        open={status === "error"}
        onClose={handleCloseAlert<Status>("idle", setStatus)}
      />
      <Dialog
        open={isOpen}
        onClose={status === "loading" ? undefined : onCloseModal}
        aria-labelledby="logout-dialog-title"
      >
        <DialogTitle id="logout-dialog-title" sx={{ textAlign: "center" }}>
          Logout of your account
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center" }}>
            Do you want to logout of FawllerSpeaks Admin?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button disabled={status === "loading"} onClick={onCloseModal}>
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
    </>
  );
};

export default LogoutModal;

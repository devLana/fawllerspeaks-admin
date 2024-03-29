import Dialog, { type DialogProps } from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type Props = Omit<DialogProps, "aria-describedby" | "aria-labelledby">;

interface PostTagsDialogProps extends Props {
  modalTitle: string | React.ReactElement;
  contentText?: string | React.ReactElement;
}

const PostTagsDialog = (props: PostTagsDialogProps) => {
  const { contentText, modalTitle, open, children, onClose, ...rest } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      {...rest}
    >
      <DialogTitle id="form-dialog-title">{modalTitle}</DialogTitle>
      <DialogContent>
        {contentText && (
          <DialogContentText mb={2}>{contentText}</DialogContentText>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default PostTagsDialog;

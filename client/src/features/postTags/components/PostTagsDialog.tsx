import Dialog, { type DialogProps } from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type Keys = "aria-describedby" | "aria-labelledby";
type OmitDialogProps = Omit<DialogProps, Keys>;

interface PostTagsDialogProps extends OmitDialogProps {
  title: string;
  contentText: string;
}

const PostTagsDialog = (props: PostTagsDialogProps) => {
  const { contentText, title, open, children, onClose, ...restProps } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      {...restProps}
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText mb={2}>{contentText}</DialogContentText>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default PostTagsDialog;

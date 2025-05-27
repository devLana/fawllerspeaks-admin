import Alert, { type AlertColor } from "@mui/material/Alert";
import EditPostWrapper from "./EditPostWrapper";

interface EditPostTextContentProps {
  id: string;
  message: string;
  severity?: AlertColor;
}

const EditPostTextContent = (props: EditPostTextContentProps) => {
  const { id, message, severity = "info" } = props;

  return (
    <EditPostWrapper id={id}>
      <Alert severity={severity} role="status">
        {message}
      </Alert>
    </EditPostWrapper>
  );
};

export default EditPostTextContent;

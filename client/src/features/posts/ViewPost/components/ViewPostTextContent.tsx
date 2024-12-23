import Alert, { type AlertColor } from "@mui/material/Alert";
import ViewPostWrapper from "./ViewPostWrapper";

interface ViewPostTextContentProps {
  label: string;
  text: string;
  severity?: AlertColor;
}

const ViewPostTextContent = (props: ViewPostTextContentProps) => {
  const { label, text, severity = "info" } = props;

  return (
    <ViewPostWrapper label={label}>
      <Alert severity={severity} role="status">
        {text}
      </Alert>
    </ViewPostWrapper>
  );
};

export default ViewPostTextContent;

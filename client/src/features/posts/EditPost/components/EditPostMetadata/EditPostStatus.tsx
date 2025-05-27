import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import type { UseFormRegisterReturn } from "react-hook-form";

import TooltipHint from "@features/posts/components/TooltipHint";
import { postStatusColors as colors } from "@utils/posts/postStatusColors";
import type { PostStatus } from "@apiTypes";

interface EditPostStatusProps {
  field: UseFormRegisterReturn<"editStatus">;
  editStatus: boolean;
  editStatusError: string | undefined;
  status: PostStatus;
}

const EditPostStatus = (props: EditPostStatusProps) => {
  const { status, editStatus, field } = props;
  const ID = props.editStatusError ? "edit-status-helper-text" : undefined;
  let label: string;
  let text: string;

  if (status === "Draft" || status === "Unpublished") {
    label = "Publish Post";
    text = "'Publish'";
  } else {
    label = "Unpublish Post";
    text = "'Unpublish'";
  }

  return (
    <div>
      <Typography>
        Post Status: &nbsp;
        <Typography
          id="post-status"
          variant="body2"
          component="span"
          sx={{
            color: ({ appTheme }) => colors(status, appTheme.themeMode),
            fontWeight: "bold",
            letterSpacing: 0.5,
          }}
        >
          {status}
        </Typography>
      </Typography>
      <TooltipHint hint={`Edit post status and ${text} this post`}>
        <FormControlLabel
          label={label}
          control={
            <Checkbox
              {...field}
              id="edit-post-status"
              size="small"
              defaultChecked={editStatus}
              inputProps={{
                "aria-describedby": `post-status,${ID}`,
                "aria-errormessage": ID,
                "aria-invalid": !!props.editStatusError,
              }}
            />
          }
          sx={{
            columnGap: 1,
            py: 1,
            px: 0.625,
            mx: 0,
            border: 1,
            borderColor: "action.active",
            borderRadius: 1,
            width: "100%",
            "&:hover": { borderColor: "text.primary" },
          }}
        />
      </TooltipHint>
      {props.editStatusError && (
        <FormHelperText id={ID} error>
          {props.editStatusError}
        </FormHelperText>
      )}
    </div>
  );
};

export default EditPostStatus;

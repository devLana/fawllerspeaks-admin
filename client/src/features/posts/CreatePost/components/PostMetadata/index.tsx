import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import TooltipHint from "./components/TooltipHint";
import ActionButtons from "../ActionButtons";
import { postMetadataValidator } from "./utils/postMetadataValidator";
import { metadataTextBoxes } from "./utils/metadataTextBoxes";
import type {
  CreatePostAction,
  RequiredPostMetadata,
  RequiredMetadataKeys,
  Status,
} from "@types";

interface PostMetadataProps {
  title: string;
  description: string;
  excerpt: string;
  draftStatus: Status;
  fileInput: React.ReactElement;
  selectPostTags: React.ReactElement;
  dispatch: React.Dispatch<CreatePostAction>;
  handleDraftPost: () => Promise<void>;
}

type BlurEvent = React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>;

const PostMetadata = ({
  title,
  description,
  excerpt,
  draftStatus,
  fileInput,
  selectPostTags,
  dispatch,
  handleDraftPost,
}: PostMetadataProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, defaultValues },
  } = useForm<RequiredPostMetadata>({
    resolver: yupResolver(postMetadataValidator),
    defaultValues: { title, description, excerpt },
  });

  const submitHandler = (values: RequiredPostMetadata) => {
    dispatch({ type: "ADD_REQUIRED_METADATA", payload: { metadata: values } });
  };

  const handleDraft = () => {
    if (!title) {
      const message = "Provide post title";

      setError("title", { message }, { shouldFocus: true });
      return;
    }

    void handleDraftPost();
  };

  const handleBlur = (e: BlurEvent) => {
    const key = e.target.name as RequiredMetadataKeys;
    const { value } = e.target;

    if (value) {
      dispatch({ type: "CHANGE_METADATA_FIELD", payload: { key, value } });
    }
  };

  return (
    <Box
      component="section"
      maxWidth={700}
      aria-live="polite"
      aria-busy="false"
      aria-labelledby="post-metadata-label"
    >
      <Typography variant="h2" gutterBottom id="post-metadata-label">
        Provide post metadata
      </Typography>
      <form aria-label="Post metadata" onSubmit={handleSubmit(submitHandler)}>
        {metadataTextBoxes.map(({ id, label, hint }) => (
          <TooltipHint key={id} hint={hint} childHasError={!!errors[id]}>
            <TextField
              type="text"
              {...register(id)}
              onBlur={handleBlur}
              id={id}
              name={id}
              autoComplete="on"
              autoFocus={id === "title"}
              fullWidth
              label={label}
              defaultValue={defaultValues?.[id] ?? ""}
              inputProps={{
                "aria-errormessage": errors[id]
                  ? `${id}-helper-text`
                  : undefined,
              }}
              error={!!errors[id]}
              helperText={errors[id]?.message ?? null}
            />
          </TooltipHint>
        ))}
        {selectPostTags}
        {fileInput}
        <ActionButtons
          label="Proceed to post content"
          status={draftStatus}
          onDraft={handleDraft}
        />
      </form>
    </Box>
  );
};

export default PostMetadata;

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import TooltipHint from "./components/TooltipHint";
import SelectPostTags from "./components/SelectPostTags";
import ActionButtons from "../ActionButtons";
import { postMetadataValidator } from "./utils/postMetadataValidator";
import { metadataTextBoxes } from "./utils/metadataTextBoxes";
import type {
  DraftErrorCb,
  CreatePostAction,
  CreateStatus,
  RequiredPostMetadata,
  RequiredMetadataKeys,
} from "@types";

type BlurEvent = React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>;

interface CreatePostMetadataProps {
  title: string;
  description: string;
  excerpt: string;
  contentError: string | undefined;
  draftStatus: CreateStatus;
  fileInput: React.ReactElement;
  selectPostTagsInput: React.ReactElement;
  dispatch: React.Dispatch<CreatePostAction>;
  handleDraftPost: (errorCb?: DraftErrorCb) => Promise<void>;
}

const CreatePostMetadata = ({
  title,
  description,
  excerpt,
  contentError,
  draftStatus,
  fileInput,
  selectPostTagsInput,
  dispatch,
  handleDraftPost,
}: CreatePostMetadataProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, defaultValues },
  } = useForm<RequiredPostMetadata>({
    resolver: yupResolver(postMetadataValidator),
    defaultValues: { title, description, excerpt },
  });

  const errorCb: DraftErrorCb = params => {
    const focus = { shouldFocus: true };

    if (params.excerptError) {
      setError("excerpt", { message: params.excerptError }, focus);
    }

    if (params.descriptionError) {
      setError("description", { message: params.descriptionError }, focus);
    }

    if (params.titleError) {
      setError("title", { message: params.titleError }, focus);
    }
  };

  const handleDraft = () => {
    let hasError = false;

    if (excerpt.length > 300) {
      const message = "Post excerpt can not be more than 300 characters";
      setError("excerpt", { message });
      hasError = true;
    }

    if (description.length > 255) {
      const message = "Post description can not be more than 255 characters";
      setError("description", { message });
      hasError = true;
    }

    if (!title) {
      setError("title", { message: "Enter post title" });
      hasError = true;
    } else if (title.length > 255) {
      const message = "Post title can not be more than 255 characters";
      setError("title", { message });
      hasError = true;
    }

    if (!hasError) void handleDraftPost(errorCb);
  };

  const handleBlur = (e: BlurEvent) => {
    const key = e.target.name as RequiredMetadataKeys;
    const { value } = e.target;

    if (value) {
      dispatch({ type: "CHANGE_METADATA_FIELD", payload: { key, value } });
    }
  };

  const submitHandler = (values: RequiredPostMetadata) => {
    dispatch({ type: "ADD_REQUIRED_METADATA", payload: { metadata: values } });
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
        {contentError && (
          <Collapse in={!!contentError}>
            <Alert severity="error" sx={{ mb: 4 }}>
              {contentError}
            </Alert>
          </Collapse>
        )}
        {metadataTextBoxes.map(({ id, label, hint }) => (
          <TooltipHint key={id} hint={hint}>
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
        <SelectPostTags>{selectPostTagsInput}</SelectPostTags>
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

export default CreatePostMetadata;

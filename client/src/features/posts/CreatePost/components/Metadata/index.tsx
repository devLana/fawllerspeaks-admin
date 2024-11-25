import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import TooltipHint from "./TooltipHint";
import SelectPostTags from "./SelectPostTags";
import ActionButtons from "../ActionButtons";
import { metadataValidator } from "@validators/metadataValidator";
import { metadataTextBoxes } from "@uiHelpers/metadataTextBoxes";
import type {
  DraftErrorCb,
  CreatePostAction,
  CreateStatus,
  RequiredPostMetadata,
} from "types/posts/createPost";
import { saveStoragePost } from "@utils/posts/storagePost";

type ChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type Keys = keyof RequiredPostMetadata;

interface MetadataProps {
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

const Metadata = ({
  contentError,
  draftStatus,
  fileInput,
  selectPostTagsInput,
  dispatch,
  handleDraftPost,
  ...props
}: MetadataProps) => {
  const { control, handleSubmit, setError, formState } =
    useForm<RequiredPostMetadata>({
      resolver: yupResolver(metadataValidator),
      values: props,
      mode: "onChange",
    });

  const handleDraft = () => {
    let hasError = false;

    if (props.excerpt.length > 300) {
      const message = "Post excerpt can not be more than 300 characters";
      setError("excerpt", { message });
      hasError = true;
    }

    if (props.description.length > 255) {
      const message = "Post description can not be more than 255 characters";
      setError("description", { message });
      hasError = true;
    }

    if (!props.title) {
      setError("title", { message: "Enter post title" });
      hasError = true;
    } else if (props.title.length > 255) {
      const message = "Post title can not be more than 255 characters";
      setError("title", { message });
      hasError = true;
    }

    if (!hasError) {
      void handleDraftPost(params => {
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
      });
    }
  };

  const handleChange = (e: ChangeEvent, onChange: (e: ChangeEvent) => void) => {
    const { name, value } = e.target as { name: Keys; value: string };
    onChange(e);
    dispatch({ type: "CHANGE_METADATA_FIELD", payload: { key: name, value } });
  };

  const submitHandler = (values: RequiredPostMetadata) => {
    saveStoragePost(values);
    dispatch({ type: "ADD_REQUIRED_METADATA", payload: { metadata: values } });
  };

  const ariaId = (id: Keys) => {
    return formState.errors[id] ? `${id}-helper-text` : undefined;
  };

  return (
    <Box
      component="section"
      aria-live="polite"
      aria-busy="false"
      aria-labelledby="post-metadata-label"
      sx={{ maxWidth: 700 }}
    >
      <Typography variant="h2" gutterBottom id="post-metadata-label">
        Provide post metadata
      </Typography>
      <form
        aria-labelledby="post-metadata-label"
        onSubmit={handleSubmit(submitHandler)}
        noValidate
      >
        {contentError && (
          <Collapse in={!!contentError}>
            <Alert severity="error" sx={{ mb: 4 }}>
              {contentError}
            </Alert>
          </Collapse>
        )}
        {metadataTextBoxes.map(({ id, label, hint }) => (
          <TooltipHint key={id} hint={hint}>
            <Controller
              name={id}
              control={control}
              render={({ field: { onChange, ref, ...rest } }) => (
                <TextField
                  type="text"
                  {...rest}
                  onChange={e => handleChange(e, onChange)}
                  id={id}
                  autoComplete="on"
                  autoFocus={id === "title"}
                  fullWidth
                  label={label}
                  inputRef={ref}
                  inputProps={{
                    "aria-errormessage": ariaId(id),
                    "aria-describedby": ariaId(id),
                  }}
                  error={!!formState.errors[id]}
                  helperText={formState.errors[id]?.message ?? null}
                />
              )}
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

export default Metadata;

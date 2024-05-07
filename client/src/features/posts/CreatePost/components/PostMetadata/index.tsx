import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import { postMetadataValidator } from "./utils/postMetadataValidator";
import { metadataTextBoxes } from "./utils/metadataTextBoxes";
import TooltipHint from "./components/TooltipHint";
import type {
  CreatePostAction,
  RequiredPostMetadata,
  RequiredMetadataKeys,
} from "@types";

interface PostMetadataProps {
  title: string;
  description: string;
  excerpt: string;
  draftStatus: "idle" | "loading" | "error";
  fileInput: React.ReactElement;
  selectPostTags: React.ReactElement;
  dispatch: React.Dispatch<CreatePostAction>;
  handleDraftPost: () => Promise<void>;
}

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

  const ariaErrorMessage = (key: keyof RequiredPostMetadata) => {
    return errors[key] ? `${key}-helper-text` : undefined;
  };

  const handleDraft = () => {
    if (!title) {
      const message = "Provide post title";

      setError("title", { message }, { shouldFocus: true });
      return;
    }

    void handleDraftPost();
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: RequiredMetadataKeys
  ) => {
    const { value } = e.target;

    if (value) {
      dispatch({ type: "CHANGE_METADATA_FIELD", payload: { key: id, value } });
    }
  };

  return (
    <Box component="section" maxWidth={700}>
      <Typography variant="h2" gutterBottom>
        Provide post metadata below
      </Typography>
      <form aria-label="Post metadata" onSubmit={handleSubmit(submitHandler)}>
        {metadataTextBoxes.map(({ id, label, hint }) => (
          <TooltipHint key={id} hint={hint} childHasError={!!errors[id]}>
            <TextField
              type="text"
              {...register(id)}
              onBlur={e => handleBlur(e, id)}
              id={id}
              autoComplete="on"
              fullWidth
              label={label}
              defaultValue={defaultValues?.[id] ?? ""}
              inputProps={{ "aria-errormessage": ariaErrorMessage(id) }}
              error={!!errors[id]}
              helperText={errors[id]?.message ?? null}
            />
          </TooltipHint>
        ))}
        {selectPostTags}
        {fileInput}
        <Box
          display="flex"
          justifyContent="center"
          flexWrap="wrap"
          rowGap={1}
          columnGap={2}
          mt={4}
        >
          <LoadingButton
            variant="outlined"
            loading={draftStatus === "loading"}
            onClick={handleDraft}
          >
            <span>Save as draft</span>
          </LoadingButton>
          <Button
            variant="contained"
            type="submit"
            disabled={draftStatus === "loading"}
          >
            Next
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default PostMetadata;

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import { postMetadataValidator } from "./utils/postMetadataValidator";
import { metadataTextBoxes } from "./utils/metadataTextBoxes";
import TooltipHint from "./components/TooltipHint";
import type { PostView, StateSetterFn } from "@types";
import type { CreatePostInput } from "@apiTypes";

interface PostMetadataProps {
  title: string;
  description: string;
  excerpt: string;
  fileInput: React.ReactElement;
  selectPostTags: React.ReactElement;
  draftStatus: "idle" | "loading" | "error";
  handleMetadata: (title: string, description: string, excerpt: string) => void;
  handleDraftPost: () => Promise<void>;
  setView: StateSetterFn<PostView>;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type PostMetadataValues = Pick<CreatePostInput, "title" | "description"> & {
  excerpt: string;
};

const PostMetadata = ({
  title,
  description,
  excerpt,
  fileInput,
  selectPostTags,
  draftStatus,
  handleDraftPost,
  handleMetadata,
  setView,
  onInput,
}: PostMetadataProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, defaultValues },
  } = useForm<PostMetadataValues>({
    resolver: yupResolver(postMetadataValidator),
    defaultValues: { title, description, excerpt },
  });

  const submitHandler = (values: PostMetadataValues) => {
    setView("content");
    handleMetadata(values.title, values.description, values.excerpt);
  };

  const ariaErrorMessage = (key: keyof PostMetadataValues) => {
    return errors[key] ? `${key}-helper-text` : undefined;
  };

  return (
    <Box component="section" maxWidth={700}>
      <Typography variant="h2" gutterBottom>
        Provide post metadata below
      </Typography>
      <form aria-label="Post metadata" onSubmit={handleSubmit(submitHandler)}>
        {metadataTextBoxes.map(({ id, label, hint, hasOnInput }) => (
          <TooltipHint key={id} hint={hint} childHasError={!!errors[id]}>
            <TextField
              {...register(id)}
              onInput={hasOnInput ? onInput : undefined}
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
        <Stack
          direction="row"
          justifyContent="center"
          flexWrap="wrap"
          rowGap={1}
          columnGap={2}
          mt={4}
        >
          <LoadingButton
            variant="outlined"
            loading={draftStatus === "loading"}
            onClick={handleDraftPost}
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
        </Stack>
      </form>
    </Box>
  );
};

export default PostMetadata;

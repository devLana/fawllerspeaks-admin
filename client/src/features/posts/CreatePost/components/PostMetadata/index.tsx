import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
// import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

// import MetadataList from "./components/MetadataList";
import { postMetadataValidator } from "./utils/postMetadataValidator";
import type { PostView, StateSetterFn } from "@types";
import type { CreatePostInput } from "@apiTypes";

interface PostMetadataProps {
  title: string;
  description: string;
  fileInput: React.ReactElement;
  selectPostTags: React.ReactElement;
  draftStatus: "idle" | "loading" | "error";
  handleMetadata: (title: string, description: string) => void;
  handleDraftPost: () => Promise<void>;
  setView: StateSetterFn<PostView>;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type PostMetadataValues = Pick<CreatePostInput, "title" | "description">;

const PostMetadata = ({
  title,
  description,
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
    defaultValues: { title, description },
  });

  const submitHandler = (values: PostMetadataValues) => {
    setView("content");
    handleMetadata(values.title, values.description);
  };

  const ariaErrorMessage = (key: keyof PostMetadataValues) => {
    return errors[key] ? `${key}-helper-text` : undefined;
  };

  return (
    <Box component="section" maxWidth={700}>
      {/* <Typography>Provide post metadata for the following:</Typography>
      <MetadataList /> */}
      <form aria-label="Post metadata" onSubmit={handleSubmit(submitHandler)}>
        <TextField
          {...register("title")}
          onInput={onInput}
          id="title"
          autoComplete="on"
          fullWidth
          label="Post Title"
          defaultValue={defaultValues?.title ?? ""}
          inputProps={{ "aria-errormessage": ariaErrorMessage("title") }}
          margin="normal"
          error={!!errors.title}
          helperText={errors.title?.message ?? null}
        />
        <TextField
          {...register("description")}
          id="description"
          autoComplete="on"
          fullWidth
          label="Post Description"
          defaultValue={defaultValues?.description ?? ""}
          inputProps={{ "aria-errormessage": ariaErrorMessage("description") }}
          margin="normal"
          error={!!errors.description}
          helperText={errors.description?.message ?? null}
        />
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

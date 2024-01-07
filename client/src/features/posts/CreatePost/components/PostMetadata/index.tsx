import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { postMetadataValidator } from "./utils/postMetadataValidator";
import MetadataList from "./components/MetadataList";
import type { PostView, StateSetterFn } from "@types";
import type { CreatePostInput } from "@apiTypes";

interface PostMetadataProps {
  title: string;
  description: string;
  fileInput: React.ReactElement;
  selectPostTags: React.ReactElement;
  handleMetadata: (title: string, description: string) => void;
  setView: StateSetterFn<PostView>;
}

type PostMetadataValues = Pick<CreatePostInput, "title" | "description">;

const PostMetadata = ({
  title,
  description,
  fileInput,
  selectPostTags,
  handleMetadata,
  setView,
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
    <Box>
      <Typography>Provide post metadata for the following:</Typography>
      <MetadataList />
      <Box
        component="form"
        maxWidth={700}
        aria-label="Post metadata"
        onSubmit={handleSubmit(submitHandler)}
      >
        <TextField
          {...register("title")}
          id="title"
          autoComplete="on"
          fullWidth
          label="Title"
          defaultValue={defaultValues?.title ?? ""}
          inputProps={{ "aria-errormessage": ariaErrorMessage("title") }}
          margin={errors.title ? "dense" : "normal"}
          error={!!errors.title}
          helperText={errors.title?.message ?? null}
        />
        <TextField
          {...register("description")}
          id="description"
          autoComplete="on"
          fullWidth
          label="Description"
          defaultValue={defaultValues?.description ?? ""}
          inputProps={{ "aria-errormessage": ariaErrorMessage("description") }}
          margin={errors.description ? "dense" : "normal"}
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
          <Button variant="outlined">Save as draft</Button>
          <Button variant="contained" type="submit">
            Next
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default PostMetadata;

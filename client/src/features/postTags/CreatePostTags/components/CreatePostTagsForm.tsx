import * as React from "react";

import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import AddIcon from "@mui/icons-material/Add";
import LoadingButton from "@mui/lab/LoadingButton";

import useCreatePostTags from "@hooks/createPostTags/useCreatePostTags";
import CreatePostTagsInput from "./CreatePostTagsInput";
import { CREATE_POST_TAGS } from "@mutations/createPostTags/CREATE_POST_TAGS";
import { createPostTagsSchema } from "@validators/createPostTagsSchema";
import { refetchQueries } from "@cache/refetchQueries/postTags/createPostTags";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import type { Status } from "@types";

interface CreatePostTagsFormProps {
  onCloseDialog: () => void;
  onStatusChange: (newStatus: Exclude<Status, "error">) => void;
  status: Exclude<Status, "error">;
}

const CreatePostTagsForm = (props: CreatePostTagsFormProps) => {
  const { status, onStatusChange, onCloseDialog } = props;
  const [inputs, setInputs] = React.useState([1]);
  const [alertIsOpen, setAlertIsOpen] = React.useState(false);

  const [create, { data, error }] = useMutation(CREATE_POST_TAGS);

  const { register, handleSubmit, formState, unregister } = useForm<
    Record<string, string>
  >({ resolver: yupResolver(createPostTagsSchema(inputs)) });

  const onCompleted = useCreatePostTags(onCloseDialog, handleFormAlert);

  const handleAddMore = () => {
    const lastInputValue = inputs.at(-1) ?? 0;
    setInputs([...inputs, lastInputValue + 1]);
  };

  const handleRemoveInput = (value: number, tag: string) => {
    unregister(tag);
    setInputs(prevState => prevState.filter(val => val !== value));
  };

  const submitHandler = (values: Record<string, string>) => {
    onStatusChange("loading");

    void create({
      refetchQueries,
      variables: { tags: Object.values(values) },
      onError: () => handleFormAlert(),
      onCompleted,
    });
  };

  function handleFormAlert() {
    onStatusChange("idle");
    setAlertIsOpen(true);
  }

  const { errors } = formState;

  let alertMessage =
    "You are unable to create post tags at the moment. Please try again later";

  if (data?.createPostTags.__typename === "CreatePostTagsValidationError") {
    alertMessage = data.createPostTags.tagsError;
  } else if (data?.createPostTags.__typename === "DuplicatePostTagError") {
    alertMessage = data.createPostTags.message;
  } else if (error?.graphQLErrors?.[0]) {
    alertMessage = error.graphQLErrors[0].message;
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(submitHandler)}
        noValidate
        aria-label="create post tags"
      >
        <Grid container rowSpacing={3} columnSpacing={2} sx={{ mb: 2 }}>
          {inputs.map(value => (
            <CreatePostTagsInput
              key={value}
              fieldErrors={errors}
              numberOfInputs={inputs.length}
              value={value}
              register={register}
              onRemove={handleRemoveInput}
            />
          ))}
        </Grid>
        <Button
          startIcon={<AddIcon />}
          disabled={inputs.length === 10}
          onClick={handleAddMore}
        >
          Add More
        </Button>
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
            columnGap: 2,
          }}
        >
          <Button onClick={onCloseDialog} disabled={status === "loading"}>
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            type="submit"
            loading={status === "loading"}
          >
            <span>Create {inputs.length > 1 ? "Tags" : "Tag"}</span>
          </LoadingButton>
        </Box>
      </form>
      <Snackbar
        message={alertMessage}
        open={alertIsOpen}
        onClose={handleCloseAlert(false, setAlertIsOpen)}
      />
    </>
  );
};

export default CreatePostTagsForm;

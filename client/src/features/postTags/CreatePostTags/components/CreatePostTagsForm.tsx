import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import LoadingButton from "@mui/lab/LoadingButton";

import { usePostTags } from "../../context/PostTagsContext";
import CreatePostTagsInput from "./CreatePostTagsInput";
import { createPostTagsValidator } from "../utils/createPostTagsValidator";
import { refetchQueries } from "../utils/refetchQueries";
import { CREATE_POST_TAGS } from "../operations/CREATE_POST_TAGS";
import { handleCloseAlert } from "@utils/handleCloseAlert";

interface CreatePostTagsFormProps {
  onCloseDialog: () => void;
  onStatusChange: (newStatus: "idle" | "submitting") => void;
  status: "idle" | "submitting";
}

const CreatePostTagsForm = (props: CreatePostTagsFormProps) => {
  const { status, onStatusChange, onCloseDialog } = props;

  const [inputs, setInputs] = React.useState([1]);
  const [alertIsOpen, setAlertIsOpen] = React.useState(false);
  const router = useRouter();

  const [create, { client, data, error }] = useMutation(CREATE_POST_TAGS);

  const {
    register,
    handleSubmit,
    formState: { errors },
    unregister,
  } = useForm<Record<string, string>>({
    resolver: yupResolver(createPostTagsValidator(inputs)),
  });

  const { handleOpenAlert } = usePostTags();

  const handleAddMore = () => {
    const lastInputValue = inputs.at(-1) ?? 0;
    setInputs([...inputs, lastInputValue + 1]);
  };

  const handleRemoveInput = (value: number, tag: string) => {
    unregister(tag);
    setInputs(prevState => prevState.filter(val => val !== value));
  };

  const submitHandler = (values: Record<string, string>) => {
    onStatusChange("submitting");

    void create({
      refetchQueries,
      variables: { tags: Object.values(values) },
      onError() {
        onStatusChange("idle");
        setAlertIsOpen(true);
      },
      onCompleted(createData) {
        switch (createData.createPostTags.__typename) {
          case "AuthenticationError":
            void client.clearStore();
            void router.replace("/login?status=unauthenticated");
            break;

          case "UnknownError":
            void client.clearStore();
            void router.replace("/login?status=unauthorized");
            break;

          case "RegistrationError":
            void router.replace("/register?status=unregistered");
            break;

          case "CreatePostTagsValidationError":
          case "DuplicatePostTagError":
          default:
            onStatusChange("idle");
            setAlertIsOpen(true);
            break;

          case "CreatedPostTagsWarning":
            onCloseDialog();
            handleOpenAlert(createData.createPostTags.message);
            break;

          case "PostTags":
            onCloseDialog();
            handleOpenAlert("Post tags created");
            break;
        }
      },
    });
  };

  let alertMessage =
    "You are unable to create post tags at the moment. Please try again later";

  if (data?.createPostTags.__typename === "CreatePostTagsValidationError") {
    alertMessage = data.createPostTags.tagsError;
  } else if (data?.createPostTags.__typename === "DuplicatePostTagError") {
    alertMessage = data.createPostTags.message;
  } else if (error?.graphQLErrors[0]) {
    alertMessage = error.graphQLErrors[0].message;
  }

  return (
    <>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Grid container rowSpacing={3} columnSpacing={2} mb={2}>
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
        <Stack direction="row" justifyContent="center" mt={3} columnGap={2}>
          <Button onClick={onCloseDialog} disabled={status === "submitting"}>
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            type="submit"
            loading={status === "submitting"}
          >
            <span>Create {inputs.length > 1 ? "Tags" : "Tag"}</span>
          </LoadingButton>
        </Stack>
      </form>
      <Snackbar
        message={alertMessage}
        open={alertIsOpen}
        onClose={handleCloseAlert<boolean>(false, setAlertIsOpen)}
      />
    </>
  );
};

export default CreatePostTagsForm;

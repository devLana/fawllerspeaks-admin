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

import PostTagsDialog from "../../components/PostTagsDialog";
import CreatePostTagsInput from "./CreatePostTagsInput";
import { CREATE_POST_TAGS } from "../operations/CREATE_POST_TAGS";
import { createPostTagsValidator } from "../utils/createPostTagsValidator";
import { handleCloseAlert } from "@utils/handleCloseAlert";

interface CreatePostTagsFormProps {
  isOpen: boolean;
  onCloseDialog: () => void;
  onOpenSnackbar: (message: string) => void;
}

const CreatePostTagsDialog = (props: CreatePostTagsFormProps) => {
  const { isOpen, onCloseDialog, onOpenSnackbar } = props;

  const [inputs, setInputs] = React.useState([1]);
  const [status, setStatus] = React.useState<"idle" | "submitting">("idle");
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

  const handleAddMore = () => {
    const lastInputValue = inputs.at(-1) ?? 0;
    setInputs([...inputs, lastInputValue + 1]);
  };

  const handleRemoveInput = (value: number, tag: string) => {
    unregister(tag);
    setInputs(prevState => prevState.filter(val => val !== value));
  };

  const submitHandler = async (values: Record<string, string>) => {
    setStatus("submitting");

    const { data: createData } = await create({
      variables: { tags: Object.values(values) },
      onError() {
        setStatus("idle");
        setAlertIsOpen(true);
      },
    });

    if (createData) {
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
          setStatus("idle");
          setAlertIsOpen(true);
          break;

        case "PostTagsWarning":
          onCloseDialog();
          onOpenSnackbar(createData.createPostTags.message);
          break;

        case "PostTags":
          onCloseDialog();
          onOpenSnackbar("Post tags created");
          break;
      }
    }
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
    <PostTagsDialog
      open={isOpen}
      onClose={onCloseDialog}
      title="Create new post tags"
      contentText="You can create up to 10 post tags at a time."
      fullWidth
    >
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
          <LoadingButton
            variant="contained"
            type="submit"
            loading={status === "submitting"}
          >
            <span>Save {inputs.length > 1 ? "Tags" : "Tag"}</span>
          </LoadingButton>
          <Button onClick={onCloseDialog} disabled={status === "submitting"}>
            Cancel
          </Button>
        </Stack>
      </form>
      <Snackbar
        message={alertMessage}
        open={alertIsOpen}
        onClose={handleCloseAlert<boolean>(false, setAlertIsOpen)}
      />
    </PostTagsDialog>
  );
};

export default CreatePostTagsDialog;

import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";

import { usePostTagsPage } from "@features/postTags/context/PostTagsPageContext";
import { usePostTagsListDispatch } from "@features/postTags/context/PostTagsListDispatchContext";
import { EDIT_POST_TAG } from "../operations/EDIT_POST_TAG";
import { editPostTagValidator } from "../utils/editPostTagValidator";
import { refetchQueries } from "../utils/refetchQueries";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import type { MutationEditPostTagArgs } from "@apiTypes";

type OmitTagId = Omit<MutationEditPostTagArgs, "tagId">;

interface EditPostTagFormProps {
  name: string;
  id: string;
  status: "idle" | "submitting";
  onClick: () => void;
  onStatusChange: (nextStatus: "idle" | "submitting") => void;
}

const EditPostTagForm = (props: EditPostTagFormProps) => {
  const { name, id, status, onClick, onStatusChange } = props;

  const [alertIsOpen, setAlertIsOpen] = React.useState(false);
  const router = useRouter();

  const [edit, { client, data, error }] = useMutation(EDIT_POST_TAG);

  const {
    register,
    handleSubmit,
    formState: { errors, defaultValues },
    setError,
  } = useForm<OmitTagId>({
    resolver: yupResolver(editPostTagValidator),
    defaultValues: { name },
  });

  const { handleOpenAlert } = usePostTagsPage();
  const dispatch = usePostTagsListDispatch();

  const submitHandler = (values: OmitTagId) => {
    onStatusChange("submitting");

    void edit({
      variables: { ...values, tagId: id },
      refetchQueries,
      onError() {
        onStatusChange("idle");
        setAlertIsOpen(true);
      },
      onCompleted(editData) {
        switch (editData.editPostTag.__typename) {
          case "AuthenticationError":
            void client.clearStore();
            void router.replace("/login?status=unauthenticated");
            break;

          case "NotAllowedError":
            void client.clearStore();
            void router.replace("/login?status=unauthorized");
            break;

          case "RegistrationError":
            void router.replace("/register?status=unregistered");
            break;

          case "EditPostTagValidationError": {
            const { nameError, tagIdError } = editData.editPostTag;
            const focus = { shouldFocus: true };

            if (tagIdError) setAlertIsOpen(true);

            if (nameError) setError("name", { message: nameError }, focus);

            onStatusChange("idle");
            break;
          }

          case "DuplicatePostTagError": {
            const { message } = editData.editPostTag;

            if (message) setError("name", { message }, { shouldFocus: true });

            onStatusChange("idle");
            break;
          }

          case "UnknownError":
          case "EditedPostTagWarning":
          default:
            onStatusChange("idle");
            setAlertIsOpen(true);
            break;

          case "EditedPostTag": {
            const { __typename, ...rest } = editData.editPostTag.tag;

            handleOpenAlert("Post tag edited");
            onStatusChange("idle");
            dispatch({ type: "POST_TAG_EDITED", payload: rest });
          }
        }
      },
    });
  };

  let alertMessage =
    "You are unable to edit the post tag at the moment. Please try again later";

  if (
    data?.editPostTag.__typename === "EditPostTagValidationError" &&
    data.editPostTag.tagIdError
  ) {
    alertMessage = data.editPostTag.tagIdError;
  } else if (
    data?.editPostTag.__typename === "UnknownError" ||
    data?.editPostTag.__typename === "EditedPostTagWarning"
  ) {
    alertMessage = data.editPostTag.message;
  } else if (error?.graphQLErrors[0]) {
    alertMessage = error.graphQLErrors[0].message;
  }

  return (
    <>
      <form onSubmit={handleSubmit(submitHandler)}>
        <TextField
          id="post-tag-name"
          autoComplete="on"
          fullWidth
          label="Post Tag"
          margin={errors.name ? "dense" : "normal"}
          {...register("name")}
          helperText={errors.name?.message ?? null}
          error={!!errors.name}
          defaultValue={defaultValues?.name ?? ""}
          inputProps={{
            "aria-errormessage": errors.name
              ? "post-tag-name-helper-text"
              : undefined,
          }}
        />
        <Stack direction="row" justifyContent="center" mt={3} columnGap={2}>
          <Button onClick={onClick} disabled={status === "submitting"}>
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            type="submit"
            loading={status === "submitting"}
          >
            <span>Edit Tag</span>
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

export default EditPostTagForm;

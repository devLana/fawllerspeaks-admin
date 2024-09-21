import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";

import { usePostTagsPage } from "@context/PostTags";
import { EDIT_POST_TAG } from "@mutations/editPostTag/EDIT_POST_TAG";
import { editPostTagSchema } from "@validators/editPostTagSchema";
import { refetchQueries } from "../cache/refetchQueries";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import type { MutationEditPostTagArgs } from "@apiTypes";
import type { PostTagsListAction } from "types/postTags/getPostTags";
import useEditPostTag from "@hooks/editPostTag/useEditPostTag";

type OmitTagId = Omit<MutationEditPostTagArgs, "tagId">;

interface EditPostTagFormProps {
  name: string;
  id: string;
  status: "idle" | "submitting";
  onClick: () => void;
  onStatusChange: (nextStatus: "idle" | "submitting") => void;
  dispatch: React.Dispatch<PostTagsListAction>;
}

const EditPostTagForm = (props: EditPostTagFormProps) => {
  const { name, id, status, onClick, onStatusChange, dispatch } = props;
  const [edit, { data, error }] = useMutation(EDIT_POST_TAG);

  const { register, handleSubmit, formState, setError } = useForm<OmitTagId>({
    resolver: yupResolver(editPostTagSchema),
    defaultValues: { name },
  });

  const { handleOpenAlert } = usePostTagsPage();

  const { setAlertIsOpen, alertIsOpen, onCompleted } = useEditPostTag({
    dispatch,
    handleOpenAlert,
    onStatusChange,
    setError,
  });

  const submitHandler = (values: OmitTagId) => {
    onStatusChange("submitting");

    void edit({
      variables: { ...values, tagId: id },
      refetchQueries,
      onError() {
        onStatusChange("idle");
        setAlertIsOpen(true);
      },
      onCompleted,
    });
  };

  const { errors, defaultValues } = formState;

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
  } else if (error?.graphQLErrors?.[0]) {
    alertMessage = error.graphQLErrors[0].message;
  }

  return (
    <>
      <form onSubmit={handleSubmit(submitHandler)} noValidate>
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
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
            columnGap: 2,
          }}
        >
          ,
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
        </Box>
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

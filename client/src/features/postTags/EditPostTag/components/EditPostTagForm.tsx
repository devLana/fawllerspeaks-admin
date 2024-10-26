import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";

import useEditPostTag from "@hooks/editPostTag/useEditPostTag";
import { EDIT_POST_TAG } from "@mutations/editPostTag/EDIT_POST_TAG";
import { editPostTagSchema } from "@validators/editPostTagSchema";
import { refetchQueries } from "@cache/refetchQueries/postTags/editPostTag";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import type { MutationEditPostTagArgs } from "@apiTypes";
import type { Status } from "@types";

type OmitTagId = Omit<MutationEditPostTagArgs, "tagId">;

interface EditPostTagFormProps {
  id: string;
  name: string;
  status: Exclude<Status, "error">;
  onClose: () => void;
  onUnknownTag: () => void;
  onEdit: ({ id, name }: { id: string; name: string }) => void;
  onStatusChange: (nextStatus: Exclude<Status, "error">) => void;
}

const EditPostTagForm = (props: EditPostTagFormProps) => {
  const { name, id, status, onClose, onStatusChange, ...rest } = props;

  const [edit, { data, error }] = useMutation(EDIT_POST_TAG);

  const { register, handleSubmit, formState, setError } = useForm<OmitTagId>({
    resolver: yupResolver(editPostTagSchema),
    defaultValues: { name },
  });

  const { setAlertIsOpen, alertIsOpen, onCompleted } = useEditPostTag({
    onEdit: rest.onEdit,
    setError,
    onUnknownTag: rest.onUnknownTag,
    onStatusChange,
  });

  const submitHandler = (values: OmitTagId) => {
    onStatusChange("loading");

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
  } else if (data?.editPostTag.__typename === "EditedPostTagWarning") {
    alertMessage = data.editPostTag.message;
  } else if (error?.graphQLErrors?.[0]) {
    alertMessage = error.graphQLErrors[0].message;
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(submitHandler)}
        noValidate
        aria-label="edit post tag"
      >
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
          <Button onClick={onClose} disabled={status === "loading"}>
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            type="submit"
            loading={status === "loading"}
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

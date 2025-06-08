import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { yupResolver } from "@hookform/resolvers/yup";

import useDeletePostContentImages from "@hooks/useDeletePostContentImages";
import EditPostStatus from "./EditPostStatus";
import EditPostRequiredMetadataInputs from "./EditPostRequiredMetadataInputs";
import EditPostFileInput from "./EditPostFileInput";
import MetadataPostTags from "@features/posts/components/PostMetadataPostTagsInput/MetadataPostTags";
import PostMetadataPostTagsInput from "@features/posts/components/PostMetadataPostTagsInput";
import EditPostErrorsAlert from "../EditPostErrorsAlert";
import { edit } from "@validators/editPostMetadataSchema";
import * as storagePost from "@utils/posts/editStoragePost";
import type { PostStatus } from "@apiTypes";
import type { PostActionStatus, RequiredFieldErrors } from "types/posts";
import type * as types from "types/posts/editPost";

interface EditPostMetadataProps {
  postId: string;
  postSlug: string;
  editErrors: types.EditPostFieldErrors;
  editStatus: PostActionStatus;
  postData: Omit<types.EditPostStateData, "id" | "content">;
  postTagsData: types.PostTagsFetchData;
  status: PostStatus;
  storagePostIsNotLoaded: boolean;
  onCloseEditError: VoidFunction;
  dispatch: React.Dispatch<types.EditPostAction>;
}

const EditPostMetadata = (props: EditPostMetadataProps) => {
  const {
    formState: { errors, defaultValues },
    clearErrors,
    handleSubmit,
    register,
    resetField,
    setError,
    setValue,
  } = useForm<types.EditPostMetadataFields>({
    resolver: yupResolver(edit(props.status)),
    defaultValues: {
      title: props.postData.title,
      description: props.postData.description,
      excerpt: props.postData.excerpt,
      tagIds: props.postData.tagIds,
      imageBanner: props.postData.imageBanner.file,
      editStatus: props.postData.editStatus,
    },
  });

  const deleteImages = useDeletePostContentImages();

  const submitHandler = (metadata: types.EditPostMetadataFields) => {
    const post = storagePost.getEditStoragePost();

    if (post?.imgUrls && props.storagePostIsNotLoaded) {
      deleteImages(post.imgUrls);
      localStorage.removeItem(storagePost.EDIT_STORAGE_POST);
    }

    storagePost.saveEditStoragePost({ id: props.postId, slug: props.postSlug });
    window.scrollTo({ top: 0, behavior: "smooth" });
    props.dispatch({ type: "PROCEED_TO_POST_CONTENT", payload: { metadata } });
  };

  const { tagIdsError, imageBannerError, descriptionError } = props.editErrors;
  const { idError, editStatusError, contentError } = props.editErrors;
  const titleError = errors.title?.message ?? props.editErrors.titleError;
  const excerptErr = errors.excerpt?.message ?? props.editErrors.excerptError;
  const errorMsg = errors.description?.message ?? descriptionError;

  const requiredFieldErrors: RequiredFieldErrors = {
    ...(titleError && { titleError }),
    ...(errorMsg && { descriptionError: errorMsg }),
    ...(excerptErr && { excerptError: excerptErr }),
  };

  return (
    <Box
      component="section"
      aria-live="polite"
      aria-busy="false"
      aria-label="Edit post metadata"
      sx={{ maxWidth: 700 }}
    >
      <form
        aria-label="Edit post metadata"
        onSubmit={handleSubmit(submitHandler)}
        noValidate
      >
        <EditPostRequiredMetadataInputs
          register={register}
          errors={requiredFieldErrors}
          defaultValues={{
            title: defaultValues?.title,
            description: defaultValues?.description,
            excerpt: defaultValues?.excerpt,
          }}
        />
        <MetadataPostTags {...props.postTagsData}>
          <PostMetadataPostTagsInput
            tagIdsError={errors.tagIds?.message ?? tagIdsError}
            field={{
              defaultValue: (defaultValues?.tagIds as string[]) ?? [],
              ...register("tagIds"),
            }}
          />
        </MetadataPostTags>
        <EditPostFileInput
          imageBanner={props.postData.imageBanner}
          imageBannerError={errors.imageBanner?.message ?? imageBannerError}
          dispatch={props.dispatch}
          onError={message => setError("imageBanner", { message })}
          onSelectImage={payload => setValue("imageBanner", payload)}
          resetField={() => resetField("imageBanner")}
          clearError={() => clearErrors("imageBanner")}
          register={register("imageBanner")}
        />
        <EditPostStatus
          field={register("editStatus")}
          status={props.status}
          editStatusError={errors.editStatus?.message ?? editStatusError}
          editStatus={defaultValues?.editStatus ?? false}
        />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button variant="contained" type="submit">
            Proceed to post content
          </Button>
        </Box>
      </form>
      <EditPostErrorsAlert
        shouldOpen={props.editStatus === "inputError"}
        onClick={props.onCloseEditError}
        idError={idError}
        contentError={contentError}
      />
    </Box>
  );
};

export default EditPostMetadata;

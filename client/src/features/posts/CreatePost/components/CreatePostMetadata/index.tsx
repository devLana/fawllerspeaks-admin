import { ValidationError } from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import useGetPostTags from "@hooks/getPostTags/useGetPostTags";
import useDeletePostContentImages from "@hooks/useDeletePostContentImages";
import CreatePostRequiredMetadataInputs from "./CreatePostRequiredMetadataInputs";
import MetadataPostTags from "@features/posts/components/PostMetadataPostTagsInput/MetadataPostTags";
import PostMetadataPostTagsInput from "@features/posts/components/PostMetadataPostTagsInput";
import CreatePostFileInput from "./CreatePostFileInput";
import CreatePostActionButtons from "@features/posts/CreatePost/components/CreatePostActionButtons";
import PostErrorsAlert from "@features/posts/components/PostErrorsAlert";
import { create, draft } from "@validators/createPostMetadataSchema";
import * as storagePost from "@utils/posts/createStoragePost";
import type * as p from "types/posts";
import type * as types from "types/posts/createPost";

interface CreatePostMetadataProps {
  postData: p.PostMetadataFields;
  draftStatus: p.PostActionStatus;
  errors: types.CreatePostFieldErrors;
  shouldShowErrors: boolean;
  storagePostIsNotLoaded: boolean;
  handleHideErrors: VoidFunction | undefined;
  onDraft: (metadata?: p.PostMetadataFields) => Promise<void>;
  dispatch: React.Dispatch<types.CreatePostAction>;
}

const CreatePostMetadata = (props: CreatePostMetadataProps) => {
  const { data, error, loading } = useGetPostTags();
  const { title, description, excerpt, tagIds, imageBanner } = props.postData;

  const {
    control,
    formState: { errors },
    clearErrors,
    getValues,
    handleSubmit,
    register,
    resetField,
    setError,
    setValue,
  } = useForm({
    resolver: yupResolver(create),
    values: { title, description, excerpt, tagIds, imageBanner },
    mode: "onChange",
  });

  const deleteImages = useDeletePostContentImages();

  const handleDraftPost = () => {
    const values = getValues();
    clearErrors();

    try {
      const metadata = draft.validateSync(values, { abortEarly: false });
      void props.onDraft(metadata);
    } catch (err) {
      if (err instanceof ValidationError) {
        err.inner.forEach(({ message, path }) => {
          if (path) setError(path as keyof p.PostMetadataFields, { message });
        });
      }
    }
  };

  const submitHandler = (metadata: p.PostMetadataFields) => {
    const post = storagePost.getCreateStoragePost();

    if (post?.content && props.storagePostIsNotLoaded) {
      deleteImages(post.content);
      localStorage.removeItem(storagePost.CREATE_STORAGE_POST);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    storagePost.saveCreateStoragePost(metadata);
    props.dispatch({ type: "PROCEED_TO_POST_CONTENT", payload: { metadata } });
  };

  const { tagIdsError, imageBannerError, descriptionError } = props.errors;
  const titleError = errors.title?.message ?? props.errors.titleError;
  const excerptErr = errors.excerpt?.message ?? props.errors.excerptError;
  const errorMsg = errors.description?.message ?? descriptionError;

  const requiredFieldErrors: p.RequiredFieldErrors = {
    ...(titleError && { titleError }),
    ...(errorMsg && { descriptionError: errorMsg }),
    ...(excerptErr && { excerptError: excerptErr }),
  };

  return (
    <Box
      component="section"
      aria-live="polite"
      aria-busy="false"
      aria-labelledby="post-metadata-label"
      sx={{ maxWidth: 700 }}
    >
      <Typography variant="h2" gutterBottom id="post-metadata-label">
        Provide post metadata
      </Typography>
      <form
        aria-labelledby="post-metadata-label"
        onSubmit={handleSubmit(submitHandler)}
        noValidate
      >
        <CreatePostRequiredMetadataInputs
          errors={requiredFieldErrors}
          control={control}
        />
        <MetadataPostTags data={data} error={error} loading={loading}>
          <Controller
            name="tagIds"
            control={control}
            render={({ field: { name, value, onChange, ref } }) => (
              <PostMetadataPostTagsInput
                tagIdsError={errors.tagIds?.message ?? tagIdsError}
                field={{ name, value, onChange, ref }}
              />
            )}
          />
        </MetadataPostTags>
        <CreatePostFileInput
          imageBanner={imageBanner}
          imageBannerError={errors.imageBanner?.message ?? imageBannerError}
          onError={message => setError("imageBanner", { message })}
          onSelectImage={payload => setValue("imageBanner", payload)}
          resetField={() => resetField("imageBanner")}
          clearError={() => clearErrors("imageBanner")}
          register={register("imageBanner")}
        />
        <CreatePostActionButtons
          nextLabel="Proceed to post content"
          actionLabel="Save As Draft"
          status={props.draftStatus}
          onAction={handleDraftPost}
        />
      </form>
      <PostErrorsAlert
        shouldShowErrors={props.shouldShowErrors}
        onClick={props.handleHideErrors}
        contentError={props.errors.contentError}
      />
    </Box>
  );
};

export default CreatePostMetadata;

export const initImage = (imageBanner: File | undefined) => ({
  error: "",
  blobUrl: imageBanner ? window.URL.createObjectURL(imageBanner) : "",
});

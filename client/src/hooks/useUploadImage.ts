import { useAuthHeaderHandler } from "@context/ApolloContext";

interface UploadImage {
  image: string;
  status: "SUCCESS";
}

const useUploadImage = () => {
  const { jwt } = useAuthHeaderHandler();

  const upload = async (file: File, fileType: "avatar" | "post") => {
    const headers = new Headers({ authorization: `Bearer ${jwt}` });

    const body = new FormData();
    body.append("image", file);
    body.append("type", fileType);

    const options: RequestInit = { method: "POST", body, headers };
    const request = new Request("http://localhost:7692/upload-image", options);

    let uploadHasError = false;
    let imageLink: string | null = null;

    try {
      const response = await fetch(request);

      if (!response.ok) {
        uploadHasError = true;
      } else {
        const imageData = (await response.json()) as UploadImage;
        imageLink = imageData.image;
      }
    } catch {
      uploadHasError = true;
    }

    return { uploadHasError, imageLink };
  };

  return upload;
};

export default useUploadImage;

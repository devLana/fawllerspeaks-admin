import * as React from "react";

const useHandleFileUrl = (imageBanner: File | null) => {
  const [fileUrl, setFileUrl] = React.useState<string | null>(() => {
    if (imageBanner) return window.URL.createObjectURL(imageBanner);
    return null;
  });

  React.useEffect(() => {
    return () => {
      if (fileUrl) window.URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  return { fileUrl, setFileUrl };
};

export default useHandleFileUrl;

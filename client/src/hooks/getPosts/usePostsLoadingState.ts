import * as React from "react";
import { useRouter } from "next/router";

const usePostsLoadingState = (loading: boolean) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const routeChanging = React.useRef(false);
  const router = useRouter();

  React.useEffect(() => {
    const handleStart = () => {
      routeChanging.current = true;
      setIsLoading(true);
    };
    const handleEnd = () => {
      routeChanging.current = false;
      setIsLoading(loading);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleEnd);
    router.events.on("routeChangeError", handleEnd);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleEnd);
      router.events.off("routeChangeError", handleEnd);
    };
  }, [router, loading]);

  React.useEffect(() => {
    if (!routeChanging.current) {
      setIsLoading(loading);
    }
  }, [loading]);

  return isLoading;
};

export default usePostsLoadingState;

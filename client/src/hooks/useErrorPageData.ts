import { useSession } from "@context/SessionContext";

const useErrorPageData = () => {
  const { userId } = useSession();

  const href = userId ? "/" : "/login";
  const label = userId ? "Go to your Dashboard" : "Login to your Dashboard";

  return { href, label };
};

export default useErrorPageData;

import { useApolloClient } from "@apollo/client";

import { useSession } from "@context/Session";
import { USER_FIELDS } from "@fragments/USER";
import type { UserInfo } from "types/user";

const useGetUserInfo = () => {
  const client = useApolloClient();
  const { userId } = useSession();

  const user = client.readFragment<UserInfo>({
    id: userId ?? "",
    fragment: USER_FIELDS,
  });

  return user;
};

export default useGetUserInfo;

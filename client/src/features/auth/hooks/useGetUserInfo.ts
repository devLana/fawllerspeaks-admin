import { useApolloClient } from "@apollo/client";

import { useSession } from "@context/Session";
import { USER_FIELDS } from "@features/auth/fragments/User";

interface UserInfo {
  id: string;
  email: string;
  isRegistered: boolean;
  firstName: string;
  lastName: string;
  image: string | null;
}

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

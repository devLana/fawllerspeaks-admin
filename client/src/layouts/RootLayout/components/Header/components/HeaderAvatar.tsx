import Skeleton from "@mui/material/Skeleton";

import useGetUserInfo from "@hooks/useGetUserInfo";
import UserAvatar from "@components/UserAvatar";

const HeaderAvatar = () => {
  const user = useGetUserInfo();

  if (!user) {
    return (
      <Skeleton variant="circular" aria-label="Authenticating user profile">
        <UserAvatar user={user} renderWithLink />
      </Skeleton>
    );
  }

  return <UserAvatar user={user} renderWithLink />;
};

export default HeaderAvatar;

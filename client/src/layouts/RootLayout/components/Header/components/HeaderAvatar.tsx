import Skeleton from "@mui/material/Skeleton";

import useGetUserInfo from "@hooks/useGetUserInfo";
import UserAvatar from "@components/UserAvatar";

const HeaderAvatar = () => {
  const user = useGetUserInfo();

  const avatar = <UserAvatar user={user} renderWithLink />;

  if (!user) {
    return (
      <Skeleton variant="circular" aria-label="Authenticating user profile">
        {avatar}
      </Skeleton>
    );
  }

  return avatar;
};

export default HeaderAvatar;

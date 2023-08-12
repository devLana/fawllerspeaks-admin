import UserAvatar from "@components/UserAvatar";
import useGetUserInfo from "@hooks/useGetUserInfo";

const HeaderAvatar = () => {
  const user = useGetUserInfo();
  return <UserAvatar user={user} renderWithLink />;
};

export default HeaderAvatar;

import Avatar, { type AvatarProps } from "@mui/material/Avatar";
import type { Theme } from "@mui/material/styles";

import useGetUserInfo from "@hooks/session/useGetUserInfo";
import NextLink from "../NextLink";
import type { SxPropsArray } from "@types";

interface UserAvatarProps {
  sx?: AvatarProps["sx"];
  renderWithLink?: boolean;
}

const UserAvatar = ({ renderWithLink = false, sx = [] }: UserAvatarProps) => {
  const userInfo = useGetUserInfo();
  const sxProp: SxPropsArray = Array.isArray(sx) ? sx : [sx];

  if (!userInfo) {
    return (
      <Avatar
        aria-label="User avatar"
        sx={[{ bgcolor: "text.disabled" }, ...sxProp]}
      />
    );
  }

  const { firstName, lastName, image } = userInfo;

  if (image) {
    return renderWithLink ? (
      <NextLink href="/settings/me">
        <Avatar
          src={image}
          alt={`${firstName} ${lastName} avatar`}
          sx={[...sxProp]}
        />
      </NextLink>
    ) : (
      <Avatar
        src={image}
        alt={`${firstName} ${lastName} avatar`}
        sx={[...sxProp]}
      />
    );
  }

  const bgcolor = (theme: Theme) => {
    return theme.appTheme.themeMode === "sunny"
      ? "secondary.light"
      : "secondary.dark";
  };

  return renderWithLink ? (
    <NextLink href="/settings/me" sx={{ fontStyle: "normal" }}>
      <Avatar
        sx={[{ bgcolor, color: "primary.main", fontSize: 17 }, ...sxProp]}
      >
        {`${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()}
      </Avatar>
    </NextLink>
  ) : (
    <Avatar sx={[{ bgcolor, color: "primary.main", fontSize: 17 }, ...sxProp]}>
      {`${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()}
    </Avatar>
  );
};

export default UserAvatar;

import Image from "next/image";
import Avatar, { type AvatarProps } from "@mui/material/Avatar";

import NextLink from "../NextLink";
import type { SxPropArray } from "@appTypes";

interface UserAvatarProps {
  image: string | null | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  hasLink?: boolean;
  sx?: AvatarProps["sx"];
}

const UserAvatar = (props: UserAvatarProps) => {
  const { image, firstName, lastName, hasLink = false, sx = [] } = props;
  const sxProp: SxPropArray = Array.isArray(sx) ? sx : [sx];

  if (!firstName || !lastName) {
    return (
      <Avatar
        aria-label="User avatar"
        sx={[{ bgcolor: "text.disabled" }, ...sxProp]}
      />
    );
  }

  const avatar = (
    <Avatar
      src={image ?? undefined}
      alt={`${firstName} ${lastName} avatar`}
      sx={[
        {
          color: "primary.main",
          fontSize: 17,
          position: "relative",
          bgcolor({ appTheme: { themeMode: mode } }) {
            return mode === "sunny" ? "secondary.light" : "secondary.dark";
          },
        },
        ...sxProp,
      ]}
      slotProps={
        { img: { component: Image, fill: true } } as AvatarProps["slotProps"]
      }
    >
      {`${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()}
    </Avatar>
  );

  return hasLink ? <NextLink href="/settings/me">{avatar}</NextLink> : avatar;
};

export default UserAvatar;

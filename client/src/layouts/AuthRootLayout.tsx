import Container from "@mui/material/Container";

import Metadata from "@layouts/components/Metadata";
import type { MetadataProps } from "@appTypes";

interface AuthRootLayoutProps extends MetadataProps {
  children: React.ReactNode;
}

const AuthRootLayout = ({ children, ...props }: AuthRootLayoutProps) => (
  <Container
    sx={{
      minHeight: "100vh",
      pt: "7rem",
      pb: "4rem",
      display: "flex",
      rowGap: "1.5rem",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Metadata {...props} />
    {children}
  </Container>
);

export default AuthRootLayout;

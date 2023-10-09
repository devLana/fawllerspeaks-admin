import { useSession } from "@context/SessionContext";
import RootLayout from "./RootLayout";
import AuthRootLayout from "./AuthRootLayout";
import type { RootLayoutProps } from "@types";

const ErrorPageLayout = ({ children, ...props }: RootLayoutProps) => {
  const { userId } = useSession();

  const Layout = userId ? RootLayout : AuthRootLayout;

  return <Layout {...props}>{children}</Layout>;
};

export default ErrorPageLayout;

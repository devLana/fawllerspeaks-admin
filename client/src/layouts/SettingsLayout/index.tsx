import Typography from "@mui/material/Typography";

export interface SettingsLayoutProps {
  pageHeading: string;
  children: React.ReactElement;
}

const SettingsLayout = ({ pageHeading, children }: SettingsLayoutProps) => {
  return (
    <>
      <Typography variant="h1">{pageHeading}</Typography>
      {children}
    </>
  );
};

export default SettingsLayout;

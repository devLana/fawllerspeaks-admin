export interface MetaDataProps {
  title: string;
  description?: string;
}

export interface RootLayoutProps extends MetaDataProps {
  errorMessage: string | null;
  clientHasRendered: boolean;
  children: React.ReactElement;
}

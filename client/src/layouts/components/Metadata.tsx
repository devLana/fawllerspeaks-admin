import Head from "next/head";
import type { MetaDataProps } from "types/layouts";

const Metadata = ({ title, description }: MetaDataProps) => (
  <Head>
    <title>{title}</title>
    <meta name="robots" content="noindex,nofollow" />
    {description && <meta name="description" content={description} />}
  </Head>
);

export default Metadata;

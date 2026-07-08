import Head from "next/head";
import type { MetadataProps } from "@appTypes";

const Metadata = ({ title, description }: MetadataProps) => (
  <Head>
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
  </Head>
);

export default Metadata;

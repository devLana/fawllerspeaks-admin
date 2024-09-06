import Head from "next/head";
import type { MetaDataProps } from "@layouts/types";

const Metadata = ({ title, description }: MetaDataProps) => (
  <Head>
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
  </Head>
);

export default Metadata;

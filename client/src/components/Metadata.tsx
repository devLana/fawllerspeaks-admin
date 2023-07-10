import Head from "next/head";

export interface MetaInfo {
  title: string;
  description?: string;
}

const Metadata = ({ title, description }: MetaInfo) => (
  <Head>
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
  </Head>
);

export default Metadata;

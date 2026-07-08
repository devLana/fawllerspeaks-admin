import {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentProps,
  type DocumentContext,
} from "next/document";

import {
  DocumentHeadTags,
  documentGetInitialProps,
  type DocumentHeadTagsProps,
} from "@mui/material-nextjs/v15-pagesRouter";

import createEmotionCache from "../configs/createEmotionCache";

type MyDocumentProps = DocumentProps & DocumentHeadTagsProps;

export default function MyDocument(props: MyDocumentProps) {
  return (
    <Html lang="en">
      <Head>
        <DocumentHeadTags {...props} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const finalProps = await documentGetInitialProps(ctx, {
    emotionCache: createEmotionCache(),
  });

  return finalProps;
};

/* eslint-disable @typescript-eslint/unbound-method */
import AppDocument, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentProps,
  type DocumentContext,
} from "next/document";
import type { AppType } from "next/app";

import createEmotionServer from "@emotion/server/create-instance";

import createEmotionCache from "../configs/createEmotionCache";
import type { NextAppProps } from "@types";

type AppProps = Omit<NextAppProps, "Component">;
type TApp = React.ComponentType<React.ComponentProps<AppType> & AppProps>;

interface MyDocumentProps extends DocumentProps {
  emotionStyleTags: JSX.Element[];
}

export default function MyDocument({ emotionStyleTags }: MyDocumentProps) {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        {emotionStyleTags}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);
  const newCtx = { ...ctx };

  newCtx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: TApp) => props => {
        return <App emotionCache={cache} {...props} />;
      },
    });

  const initialProps = await AppDocument.getInitialProps(newCtx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map(style => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};

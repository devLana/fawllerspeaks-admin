import Head from "next/head";
import { CacheProvider } from "@emotion/react";

import ApolloContextProvider from "@components/ApolloContextProvider";
import MUIThemeProvider from "@components/MUIThemeProvider";
import SessionProvider from "@features/auth/components/SessionProvider";
import createEmotionCache from "../configs/createEmotionCache";
import type { NextAppProps } from "@types";

const clientSideEmotionCache = createEmotionCache();
const uiLayout = (page: React.ReactElement) => page;

export default function App(props: NextAppProps) {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;
  const { layout = uiLayout } = Component;

  return (
    <ApolloContextProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <CacheProvider value={emotionCache}>
        <MUIThemeProvider>
          <SessionProvider
            layout={layout}
            page={<Component {...pageProps} />}
          />
        </MUIThemeProvider>
      </CacheProvider>
    </ApolloContextProvider>
  );
}

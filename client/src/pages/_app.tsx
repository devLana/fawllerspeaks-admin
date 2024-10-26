import Head from "next/head";
import { CacheProvider } from "@emotion/react";

import AuthProvider from "@context/Auth/AuthProvider";
import AppThemeProvider from "@context/AppTheme/AppThemeProvider";
import SessionProvider from "@context/Session/SessionProvider";
import createEmotionCache from "configs/createEmotionCache";
import type { NextAppProps } from "@types";

const clientSideEmotionCache = createEmotionCache();
const uiLayout = (page: React.ReactElement) => page;

export default function App(props: NextAppProps) {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;
  const { layout = uiLayout } = Component;

  return (
    <AuthProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <CacheProvider value={emotionCache}>
        <AppThemeProvider>
          <SessionProvider
            layout={layout}
            page={<Component {...pageProps} />}
          />
        </AppThemeProvider>
      </CacheProvider>
    </AuthProvider>
  );
}

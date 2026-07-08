import Head from "next/head";
import type { AppProps } from "next/app";
import type { EmotionCache } from "@emotion/react";

import { AppCacheProvider } from "@mui/material-nextjs/v15-pagesRouter";

import AuthProvider from "@providers/Auth";
import AppThemeProvider from "@providers/AppTheme";
import ToastProvider from "@providers/Toast";
import createEmotionCache from "@configs/createEmotionCache";

export interface NextAppProps extends AppProps {
  emotionCache?: EmotionCache;
  pageProps: Record<string, unknown>;
}

export default function App(props: NextAppProps) {
  const { Component, pageProps, emotionCache = createEmotionCache() } = props;

  return (
    <AppCacheProvider emotionCache={emotionCache}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AuthProvider>
        <AppThemeProvider>
          <ToastProvider>
            <Component {...pageProps} />
          </ToastProvider>
        </AppThemeProvider>
      </AuthProvider>
    </AppCacheProvider>
  );
}

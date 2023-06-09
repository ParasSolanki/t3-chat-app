import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Router from "next/router";
import NProgress from "nprogress";
import { Toaster } from "react-hot-toast";
import localFont from "next/font/local";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import "~/styles/nprogress.css";

const inter = localFont({
  src: [
    {
      path: "../assets/fonts/Inter-italic.var.woff2",
      style: "italic",
    },
    {
      path: "../assets/fonts/Inter-roman.var.woff2",
      style: "normal",
    },
  ],
  preload: true,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ className: "!bg-zinc-800 !text-zinc-50 !shadow-md" }}
      />
      <main className={`${inter.className}`}>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

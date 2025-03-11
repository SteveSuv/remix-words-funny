import {
  Links,
  LinksFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { ReactNode } from "react";
import { AppLayout } from "~/components/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpcServer } from "~/common/trpc";
import { HeroUIProvider } from "@heroui/react";
import { GlobalComponents } from "~/components/GlobalComponents";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { Route } from "./+types/root";
import globalStyle from "~/global.css?url";
import merriweatherStyle from "@fontsource/merriweather/latin-400?url";

export const loader = async (args: Route.LoaderArgs) => {
  const [{ myUserInfo }, { allBooks }] = await Promise.all([
    trpcServer(args.request).loader.getMyUserInfo.query(),
    trpcServer(args.request).loader.getAllBooks.query(),
  ]);
  return { myUserInfo, allBooks };
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: globalStyle,
    },
    {
      rel: "stylesheet",
      href: merriweatherStyle,
    },
  ];
};

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className="bg-background text-foreground"
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="study english words so funny" />
        <meta name="keywords" content="english,words,study" />
        <meta name="author" content="https://github.com/SteveSuv" />
        <meta
          name="repository"
          content="https://github.com/SteveSuv/remix-words-funny"
        />
        <Meta />
        <Links />
        <title>WordsFunny</title>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App({
  loaderData: { myUserInfo, allBooks },
}: Route.ComponentProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      <HeroUIProvider>
        <QueryClientProvider client={queryClient}>
          <AppLayout allBooks={allBooks}>
            <Outlet context={{ myUserInfo, allBooks }} />
          </AppLayout>
          <GlobalComponents />
        </QueryClientProvider>
      </HeroUIProvider>
    </NextThemesProvider>
  );
}

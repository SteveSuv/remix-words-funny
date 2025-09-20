import merriweatherStyle from "@fontsource/merriweather/latin-400?url";
import {
  Card,
  CardBody,
  CardHeader,
  Code,
  Divider,
  HeroUIProvider,
} from "@heroui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";
import {
  isRouteErrorResponse,
  Links,
  LinksFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { queryClient } from "~/common/queryClient";
import { trpcServer } from "~/common/trpc";
import { AppLayout } from "~/components/AppLayout";
import { GlobalComponents } from "~/components/GlobalComponents";
import globalStyle from "~/styles/global.css?url";
import type { Route } from "./+types/root";

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

export const loader = async (args: Route.LoaderArgs) => {
  const [{ myUserInfo }, { allBooks }, { starBooks }] = await Promise.all([
    trpcServer(args.request).loader.getMyUserInfo.query(),
    trpcServer(args.request).loader.getAllBooks.query(),
    trpcServer(args.request).loader.getStarBooks.query(),
  ]);
  return { myUserInfo, allBooks, starBooks };
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
        <meta name="description" content="study English words so funny" />
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

export default function App({
  loaderData: { myUserInfo, allBooks, starBooks },
}: Route.ComponentProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      <HeroUIProvider>
        <QueryClientProvider client={queryClient}>
          <AppLayout allBooks={allBooks} starBooks={starBooks}>
            <Outlet context={{ myUserInfo }} />
          </AppLayout>
          <GlobalComponents />
        </QueryClientProvider>
      </HeroUIProvider>
    </NextThemesProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "服务器出错了";
  let details = "很抱歉，服务器遇到问题，暂时无法处理您的请求。请稍后再试。";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "页面不存在" : "出错了";
    details =
      error.status === 404
        ? "您访问的页面不存在，可能是链接已过期或地址有误。请检查网址，或返回首页继续浏览。"
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center gap-8">
      <Card className="w-[90%] xl:w-1/2">
        <CardHeader>{message}</CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-4">
          <div>{details}</div>
          {!!stack && (
            <Code color="danger" className="w-full overflow-x-auto p-4">
              <pre>{stack}</pre>
            </Code>
          )}
        </CardBody>
      </Card>
    </main>
  );
}

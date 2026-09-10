import { Card } from "@heroui/react";
import type { ReactNode } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { AppLayout } from "~/components/layout";
import type { Route } from "./+types/root";
import "@fontsource/merriweather/latin-400.css";
import "./global.css";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="zh-CN"
      className="bg-background text-foreground light"
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="轻松学习英语单词" />
        <meta name="keywords" content="english,words,study" />
        <meta name="author" content="https://github.com/SteveSuv" />
        <meta
          name="repository"
          content="https://github.com/SteveSuv/remix-words-funny"
        />
        <Meta />
        <Links />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
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

export default function App() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "出错了";
  let details = "页面遇到问题，请稍后再试。";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "页面不存在" : "出错了";
    details =
      error.status === 404
        ? "你访问的页面不存在。"
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="flex h-screen w-screen items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <Card>
          <Card.Header>
            <Card.Title>{message}</Card.Title>
            <Card.Description>{details}</Card.Description>
          </Card.Header>
          {stack && (
            <Card.Content>
              <pre className="bg-surface-tertiary max-h-96 w-full overflow-x-auto rounded-md p-4 text-sm">
                <code>{stack}</code>
              </pre>
            </Card.Content>
          )}
        </Card>
      </div>
    </main>
  );
}

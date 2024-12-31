import { createTRPCProxyClient, httpLink } from "@trpc/client";
import SuperJSON from "superjson";
import { AppRouter } from "~/.server/trpc/router";
import { TRPC_URL } from "./constants";

// use trpcServer to fetch in server environment, like in loader, for passing cookies to trpc endpoint
export const trpcServer = (request?: Request) => {
  return createTRPCProxyClient<AppRouter>({
    transformer: SuperJSON,
    links: [
      httpLink({
        url: TRPC_URL,
        headers: () => {
          const cookie = request?.headers.get("Cookie") || "";
          return { cookie };
        },
      }),
    ],
  });
};

// use trpcClient to fetch in frontend environment, like in react component, cookies will be passing to trpc endpoint automatically
export const trpcClient = createTRPCProxyClient<AppRouter>({
  transformer: SuperJSON,
  links: [
    httpLink({
      url: TRPC_URL,
    }),
  ],
});

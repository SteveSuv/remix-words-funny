import { createTRPCProxyClient, httpLink } from "@trpc/client";
import SuperJSON from "superjson";
import { AppRouter } from "~/.server/trpc/router";
import { TRPC_URL } from "./constants";

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

export const trpcClient = createTRPCProxyClient<AppRouter>({
  transformer: SuperJSON,
  links: [
    httpLink({
      url: TRPC_URL,
    }),
  ],
});

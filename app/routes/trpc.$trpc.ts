import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "~/.server/trpc/router";
import { createTRPCContext } from "~/.server/trpc";
import { Route } from "./+types/trpc.$trpc";

const handleRequest = (args: Route.LoaderArgs | Route.ActionArgs) => {
  return fetchRequestHandler({
    endpoint: "/trpc",
    req: args.request,
    router: appRouter,
    createContext: createTRPCContext,
  });
};

export const loader = (args: Route.LoaderArgs) => {
  return handleRequest(args);
};

export const action = (args: Route.ActionArgs) => {
  return handleRequest(args);
};

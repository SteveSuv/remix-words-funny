import { ORPCError, os } from "@orpc/server";
import type {
  RequestHeadersHandlerPluginContext,
  ResponseHeadersHandlerPluginContext,
} from "@orpc/server/plugins";

export type ServerContext = RequestHeadersHandlerPluginContext &
  ResponseHeadersHandlerPluginContext & {
    userId?: number;
  };

export const orpc = os.$context<ServerContext>();

const authMiddleware = orpc.middleware(
  async ({ context: { userId }, next }) => {
    if (!userId) {
      throw new ORPCError("UNAUTHORIZED", { message: "请先登录" });
    }

    return next();
  },
);

const unAuthMiddleware = orpc.middleware(
  async ({ context: { userId }, next }) => {
    if (userId) {
      throw new ORPCError("BAD_REQUEST", { message: "您已登录" });
    }

    return next();
  },
);

export const p = {
  public: orpc,
  auth: orpc.use(authMiddleware),
  unAuth: orpc.use(unAuthMiddleware),
};

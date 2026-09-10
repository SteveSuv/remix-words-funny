import { onError } from "@orpc/server";
import { getCookie } from "@orpc/server/helpers";
import { RPCHandler } from "@orpc/server/fetch";
import {
  RequestCompressionHandlerPlugin,
  RequestHeadersHandlerPlugin,
  ResponseCompressionHandlerPlugin,
  ResponseHeadersHandlerPlugin,
} from "@orpc/server/plugins";
import jwt from "jsonwebtoken";
import { JWT_KEY, RPC_URL } from "~/common/constants";
import type { ServerContext } from "./common/orpc";
import { router } from "./router";

const { JWT_SECRET } = process.env;

const orpcHandler = new RPCHandler<ServerContext>(router, {
  plugins: [
    new RequestCompressionHandlerPlugin(),
    new RequestHeadersHandlerPlugin(),
    new ResponseHeadersHandlerPlugin(),
    new ResponseCompressionHandlerPlugin(),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export async function handleRequest(request: Request) {
  const token = getCookie(request.headers, JWT_KEY);

  let userId: number | undefined;

  if (token && JWT_SECRET) {
    try {
      const data = jwt.verify(token, JWT_SECRET) as { userId?: unknown };
      const parsedUserId = Number(data.userId);

      if (Number.isSafeInteger(parsedUserId) && parsedUserId > 0) {
        userId = parsedUserId;
      }
    } catch (error) {
      console.error(error);
    }
  }

  const { matched, response } = await orpcHandler.handle(request, {
    prefix: RPC_URL,
    context: { userId },
  });

  if (matched) {
    return response;
  }

  return new Response("Not Found", { status: 404 });
}

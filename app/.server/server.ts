import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import {
  RequestCompressionHandlerPlugin,
  RequestHeadersHandlerPlugin,
  ResponseCompressionHandlerPlugin,
  ResponseHeadersHandlerPlugin,
} from "@orpc/server/plugins";
import { RPC_URL } from "~/common/constants";
import { getUserIdFromRequest } from "./common/auth";
import type { ServerContext } from "./common/orpc";
import { router } from "./router";

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
  const userId = getUserIdFromRequest(request);

  const { matched, response } = await orpcHandler.handle(request, {
    prefix: RPC_URL,
    context: { userId },
  });

  if (matched) {
    return response;
  }

  return new Response("Not Found", { status: 404 });
}

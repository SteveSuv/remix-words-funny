import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { RequestCompressionLinkPlugin } from "@orpc/client/plugins";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { router } from "~/.server/router";
import { RPC_URL } from "./constants";

const link = new RPCLink({
  url: RPC_URL,
  plugins: [new RequestCompressionLinkPlugin()],
});

const client: RouterClient<typeof router> = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);

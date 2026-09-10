import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { handleRequest } from "~/.server/server";

export async function loader({ request }: LoaderFunctionArgs) {
  return handleRequest(request);
}

export async function action({ request }: ActionFunctionArgs) {
  return handleRequest(request);
}

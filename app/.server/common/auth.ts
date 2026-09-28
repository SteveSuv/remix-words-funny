import { getCookie } from "@orpc/server/helpers";
import jwt from "jsonwebtoken";
import { JWT_KEY } from "~/common/constants";

export function getUserIdFromRequest(request: Request) {
  const token = getCookie(request.headers, JWT_KEY);
  const { JWT_SECRET } = process.env;

  if (!token || !JWT_SECRET) return undefined;

  try {
    const data = jwt.verify(token, JWT_SECRET) as { userId?: unknown };
    const userId = Number(data.userId);
    return Number.isSafeInteger(userId) && userId > 0 ? userId : undefined;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

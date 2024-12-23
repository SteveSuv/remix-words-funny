import cookie, { SerializeOptions } from "cookie";
import { IS_PROD, COOKIE_MAX_AGE } from "~/common/constants";

const getCookie = (req: Request, name: string) => {
  const cookieHeader = req.headers.get("Cookie");
  if (!cookieHeader) return "";
  const cookies = cookie.parse(cookieHeader);
  return cookies[name] as string;
};

const setCookie = (
  resHeaders: Headers,
  name: string,
  value: string,
  options?: SerializeOptions,
) => {
  resHeaders.set(
    "Set-Cookie",
    cookie.serialize(name, value, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      secure: IS_PROD,
      path: "/",
      sameSite: "lax",
      ...options,
    }),
  );
};

const deleteCookie = (
  resHeaders: Headers,
  name: string,
  options?: SerializeOptions,
) => {
  resHeaders.set(
    "Set-Cookie",
    cookie.serialize(name, "", {
      maxAge: 0,
      httpOnly: true,
      secure: IS_PROD,
      path: "/",
      sameSite: "lax",
      ...options,
    }),
  );
};

export const Cookies = {
  get: getCookie,
  set: setCookie,
  delete: deleteCookie,
};

export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; //7d
export const JWT_KEY = "ACCESS_TOKEN";
export const IS_PROD = import.meta.env.PROD;

const DEV_TRPC_URL = "http://localhost:3000/trpc";
const PROD_TRPC_URL = "http://localhost:3000/trpc";
export const TRPC_URL = IS_PROD ? PROD_TRPC_URL : DEV_TRPC_URL;
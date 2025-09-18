export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; //7d
export const JWT_KEY = "ACCESS_TOKEN";
export const IS_PROD = import.meta.env.PROD;
export const PAGE_SIZE = 20;

const DEV_TRPC_URL = "http://localhost:3001/trpc";

// when deploy to prod, change to real domain
const PROD_TRPC_URL = "http://localhost:3001/trpc";

export const TRPC_URL = IS_PROD ? PROD_TRPC_URL : DEV_TRPC_URL;

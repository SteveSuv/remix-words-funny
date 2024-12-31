import { TRPCError, initTRPC } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import SuperJSON from "superjson";
import { getMyUserInfo } from "../auth";

export const createTRPCContext = async (ctx: FetchCreateContextFnOptions) => {
  const myUserInfo = await getMyUserInfo(ctx.req);
  // insert userinfo to trpc ctx
  return { ...ctx, myUserInfo, userId: myUserInfo?.id };
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// trpc instance
export const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
});

// middlewares
const isAuthed = t.middleware(({ ctx: { myUserInfo }, next }) => {
  if (!myUserInfo) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "请先登录",
    });
  }
  return next();
});

const isUnAuthed = t.middleware(({ ctx: { myUserInfo }, next }) => {
  if (!!myUserInfo) {
    throw new TRPCError({ code: "FORBIDDEN", message: "您已登录" });
  }
  return next();
});

const publicProcedure = t.procedure;
const authProcedure = publicProcedure.use(isAuthed);
const unAuthProcedure = publicProcedure.use(isUnAuthed);

// procedures
export const p = {
  public: publicProcedure,
  auth: authProcedure,
  unAuth: unAuthProcedure,
};

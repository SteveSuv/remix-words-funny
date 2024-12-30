import { TRPCError, initTRPC } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import SuperJSON from "superjson";
import { getMyUserInfo } from "../auth";

export const createTRPCContext = async (ctx: FetchCreateContextFnOptions) => {
  const myUserInfo = await getMyUserInfo(ctx.req);
  return { ...ctx, myUserInfo, userId: myUserInfo?.id };
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

export const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
});

const isAuthed = t.middleware(({ ctx: { myUserInfo }, next }) => {
  if (!myUserInfo) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "please login first",
    });
  }
  return next();
});

const isUnAuthed = t.middleware(({ ctx: { myUserInfo }, next }) => {
  if (!!myUserInfo) {
    throw new TRPCError({ code: "FORBIDDEN", message: "you are logged in" });
  }
  return next();
});

const publicProcedure = t.procedure;
const authProcedure = publicProcedure.use(isAuthed);
const unAuthProcedure = publicProcedure.use(isUnAuthed);

export const p = {
  public: publicProcedure,
  auth: authProcedure,
  unAuth: unAuthProcedure,
};

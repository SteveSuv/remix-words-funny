import type * as schema from "~/.server/db/schema";

export type IBookItem = {
  id: number;
  slug: string;
  cover: string;
  name: string;
  wordsCount: number;
};

export type ICommentItem = {
  User: typeof schema.User.$inferSelect;
  Post: typeof schema.Post.$inferSelect;
};

export type IWordItem = {
  Book?: typeof schema.Book.$inferSelect;
  Word: typeof schema.Word.$inferSelect;
};

export enum ListTabType {
  ALL = "ALL",
  DONE = "DONE",
  UNDONE = "UNDONE",
}

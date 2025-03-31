import * as schema from "~/.server/db/schema";

export type IUserInfo =
  | {
      id: number;
      name: string;
      email: string;
      avatar: string;
      createdAt: Date;
      updatedAt: Date;
    }
  | undefined;

export type IBookItem = {
  id: number;
  slug: string;
  cover: string;
  name: string;
  wordsCount: number;
};

export type IPageWordsParams = { bookSlug: string };

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

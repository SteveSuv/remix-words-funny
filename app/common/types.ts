import type * as schema from "~/.server/db/schema";

export type IBookItem = {
  id: number;
  slug: string;
  name: string;
  wordsCount: number;
};

export type ICommentItem = {
  User: Pick<typeof schema.User.$inferSelect, "id" | "name" | "avatar">;
  Post: typeof schema.Post.$inferSelect;
  replyToName: string | null;
  replyToUserId: number | null;
  postVotesCount: number;
  isPostVote: boolean;
  replies: ICommentItem[];
  nextRepliesCursor?: number;
};

export type INoticeItem = {
  Notice: typeof schema.Notice.$inferSelect;
  Actor: Pick<typeof schema.User.$inferSelect, "id" | "name" | "avatar">;
  TargetPost: Pick<
    typeof schema.Post.$inferSelect,
    "id" | "content" | "wordSlug" | "parentPostId"
  >;
  RelatedPost: Pick<typeof schema.Post.$inferSelect, "id" | "content"> | null;
  word: string;
};

export type IWordItem = {
  Book?: typeof schema.Book.$inferSelect;
  Word: typeof schema.Word.$inferSelect;
  isDone: boolean;
};

export enum ListTabType {
  ALL = "ALL",
  DONE = "DONE",
  UNDONE = "UNDONE",
}

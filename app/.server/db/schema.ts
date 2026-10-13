import { sql } from "drizzle-orm";
import { defineRelations } from "drizzle-orm/relations";
import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .$onUpdateFn(() => sql`now()`),
};

// tables
export const User = pgTable("User", {
  id: serial().primaryKey(),
  name: varchar().notNull().unique(),
  email: varchar().notNull().unique(),
  password: varchar().notNull(),
  avatar: varchar(),
  ...timestamps,
});

export const Post = pgTable(
  "Post",
  {
    id: serial().primaryKey(),
    content: text().notNull(),
    userId: integer()
      .notNull()
      .references(() => User.id),
    wordSlug: varchar()
      .notNull()
      .references(() => Word.slug),
    parentPostId: integer().references((): AnyPgColumn => Post.id),
    replyToUserId: integer().references(() => User.id),
    ...timestamps,
  },
  (table) => [
    index("Post_wordSlug_id_idx").on(table.wordSlug, table.id.desc()),
    index("Post_parentPostId_id_idx").on(table.parentPostId, table.id),
  ],
);

export const Verify = pgTable("Verify", {
  id: serial().primaryKey(),
  email: varchar().notNull().unique(),
  code: varchar(),
  expiresAt: timestamp().notNull().defaultNow(),
  consumedAt: timestamp(),
  ...timestamps,
});

export const Book = pgTable("Book", {
  id: serial().primaryKey(),
  slug: varchar().notNull().unique(),
  name: varchar().notNull(),
  ...timestamps,
});

export const Word = pgTable("Word", {
  id: serial().primaryKey(),
  bookSlug: varchar()
    .notNull()
    .references(() => Book.slug),
  slug: varchar().notNull().unique(),
  word: varchar().notNull(),
  usPronounce: varchar().notNull(),
  ukPronounce: varchar().notNull(),
  remember: varchar().notNull(),
  ...timestamps,
});

export const Cognate = pgTable(
  "Cognate",
  {
    id: serial().primaryKey(),
    wordSlug: varchar()
      .notNull()
      .references(() => Word.slug),
    pos: varchar().notNull(),
    content: varchar().notNull(),
    transCn: varchar().notNull(),
    ...timestamps,
  },
  (table) => [index("Cognate_wordSlug_idx").on(table.wordSlug)],
);

export const Phrase = pgTable(
  "Phrase",
  {
    id: serial().primaryKey(),
    wordSlug: varchar()
      .notNull()
      .references(() => Word.slug),
    content: varchar().notNull(),
    transCn: varchar().notNull(),
    ...timestamps,
  },
  (table) => [index("Phrase_wordSlug_idx").on(table.wordSlug)],
);

export const Sentence = pgTable(
  "Sentence",
  {
    id: serial().primaryKey(),
    wordSlug: varchar()
      .notNull()
      .references(() => Word.slug),
    content: varchar().notNull(),
    transCn: varchar().notNull(),
    ...timestamps,
  },
  (table) => [index("Sentence_wordSlug_idx").on(table.wordSlug)],
);

export const Synonym = pgTable(
  "Synonym",
  {
    id: serial().primaryKey(),
    wordSlug: varchar()
      .notNull()
      .references(() => Word.slug),
    pos: varchar().notNull(),
    content: varchar().notNull(),
    transCn: varchar().notNull(),
    ...timestamps,
  },
  (table) => [index("Synonym_wordSlug_idx").on(table.wordSlug)],
);

export const Translation = pgTable(
  "Translation",
  {
    id: serial().primaryKey(),
    wordSlug: varchar()
      .notNull()
      .references(() => Word.slug),
    pos: varchar().notNull(),
    transCn: varchar().notNull(),
    transEn: varchar().notNull(),
    ...timestamps,
  },
  (table) => [index("Translation_wordSlug_idx").on(table.wordSlug)],
);

export const Notice = pgTable(
  "Notice",
  {
    id: serial().primaryKey(),
    recipientUserId: integer()
      .notNull()
      .references(() => User.id),
    actorUserId: integer()
      .notNull()
      .references(() => User.id),
    type: varchar().notNull(),
    targetPostId: integer()
      .notNull()
      .references(() => Post.id),
    relatedPostId: integer().references(() => Post.id),
    isRead: boolean().notNull().default(false),
    ...timestamps,
  },
  (table) => [
    index("Notice_recipient_createdAt_id_idx").on(
      table.recipientUserId,
      table.createdAt.desc(),
      table.id.desc(),
    ),
    index("Notice_recipient_unread_idx")
      .on(table.recipientUserId)
      .where(sql`${table.isRead} = false`),
    index("Notice_actor_target_like_idx")
      .on(table.actorUserId, table.targetPostId)
      .where(sql`${table.type} = 'like'`),
  ],
);

// many-to-many tables
export const UsersToBooks = pgTable(
  "UsersToBooks",
  {
    userId: integer()
      .notNull()
      .references(() => User.id),
    bookSlug: varchar()
      .notNull()
      .references(() => Book.slug),
    ...timestamps,
  },
  (t) => [primaryKey({ columns: [t.userId, t.bookSlug] })],
);

export const UsersToWords = pgTable(
  "UsersToWords",
  {
    userId: integer()
      .notNull()
      .references(() => User.id),
    wordSlug: varchar()
      .notNull()
      .references(() => Word.slug),
    ...timestamps,
  },
  (t) => [primaryKey({ columns: [t.userId, t.wordSlug] })],
);

export const UsersToPostsVote = pgTable(
  "UsersToPostsVote",
  {
    userId: integer()
      .notNull()
      .references(() => User.id),
    postId: integer()
      .notNull()
      .references(() => Post.id),
    ...timestamps,
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.postId] }),
    index("UsersToPostsVote_postId_userId_idx").on(t.postId, t.userId),
  ],
);

export const relations = defineRelations(
  {
    User,
    Post,
    Verify,
    Book,
    Word,
    Cognate,
    Phrase,
    Sentence,
    Synonym,
    Translation,
    UsersToBooks,
    UsersToWords,
    UsersToPostsVote,
    Notice,
  },
  (r) => ({
    User: {
      UsersToBooks: r.many.UsersToBooks(),
      UsersToWords: r.many.UsersToWords(),
      UsersToPostsVote: r.many.UsersToPostsVote(),
      Posts: r.many.Post(),
      PostRepliesToUser: r.many.Post({ alias: "PostReplyToUser" }),
    },
    Post: {
      User: r.one.User({ from: r.Post.userId, to: r.User.id }),
      ReplyToUser: r.one.User({
        from: r.Post.replyToUserId,
        to: r.User.id,
        optional: true,
        alias: "PostReplyToUser",
      }),
      Word: r.one.Word({ from: r.Post.wordSlug, to: r.Word.slug }),
      ParentPost: r.one.Post({
        from: r.Post.parentPostId,
        to: r.Post.id,
        optional: true,
        alias: "PostReplies",
      }),
      Replies: r.many.Post({ alias: "PostReplies" }),
      UsersToPostsVote: r.many.UsersToPostsVote(),
    },
    Book: {
      UsersToBooks: r.many.UsersToBooks(),
      Words: r.many.Word(),
    },
    Word: {
      Book: r.one.Book({ from: r.Word.bookSlug, to: r.Book.slug }),
      UsersToWords: r.many.UsersToWords(),
      Cognates: r.many.Cognate(),
      Phrases: r.many.Phrase(),
      Sentences: r.many.Sentence(),
      Synonyms: r.many.Synonym(),
      Translations: r.many.Translation(),
      Posts: r.many.Post(),
    },
    Cognate: {
      Word: r.one.Word({ from: r.Cognate.wordSlug, to: r.Word.slug }),
    },
    Phrase: {
      Word: r.one.Word({ from: r.Phrase.wordSlug, to: r.Word.slug }),
    },
    Sentence: {
      Word: r.one.Word({ from: r.Sentence.wordSlug, to: r.Word.slug }),
    },
    Synonym: {
      Word: r.one.Word({ from: r.Synonym.wordSlug, to: r.Word.slug }),
    },
    Translation: {
      Word: r.one.Word({ from: r.Translation.wordSlug, to: r.Word.slug }),
    },
    UsersToBooks: {
      Book: r.one.Book({ from: r.UsersToBooks.bookSlug, to: r.Book.slug }),
      User: r.one.User({ from: r.UsersToBooks.userId, to: r.User.id }),
    },
    UsersToWords: {
      Word: r.one.Word({ from: r.UsersToWords.wordSlug, to: r.Word.slug }),
      User: r.one.User({ from: r.UsersToWords.userId, to: r.User.id }),
    },
    UsersToPostsVote: {
      Post: r.one.Post({ from: r.UsersToPostsVote.postId, to: r.Post.id }),
      User: r.one.User({ from: r.UsersToPostsVote.userId, to: r.User.id }),
    },
    Notice: {},
  }),
);

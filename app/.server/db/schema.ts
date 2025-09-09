import { relations } from "drizzle-orm";
import {
  AnyPgColumn,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .$onUpdateFn(() => new Date()),
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

export const Post = pgTable("Post", {
  id: serial().primaryKey(),
  content: text().notNull(),
  userId: integer()
    .notNull()
    .references(() => User.id),
  wordSlug: varchar()
    .notNull()
    .references(() => Word.slug),
  parentPostId: integer().references((): AnyPgColumn => Post.id),
  ...timestamps,
});

export const Verify = pgTable("Verify", {
  id: serial().primaryKey(),
  email: varchar().notNull().unique(),
  code: varchar(),
  ...timestamps,
});

export const Book = pgTable("Book", {
  id: serial().primaryKey(),
  slug: varchar().notNull().unique(),
  name: varchar().notNull(),
  cover: varchar().notNull(),
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

export const Cognate = pgTable("Cognate", {
  id: serial().primaryKey(),
  wordSlug: varchar()
    .notNull()
    .references(() => Word.slug),
  pos: varchar().notNull(),
  content: varchar().notNull(),
  transCn: varchar().notNull(),
  ...timestamps,
});

export const Phrase = pgTable("Phrase", {
  id: serial().primaryKey(),
  wordSlug: varchar()
    .notNull()
    .references(() => Word.slug),
  content: varchar().notNull(),
  transCn: varchar().notNull(),
  ...timestamps,
});

export const Sentence = pgTable("Sentence", {
  id: serial().primaryKey(),
  wordSlug: varchar()
    .notNull()
    .references(() => Word.slug),
  content: varchar().notNull(),
  transCn: varchar().notNull(),
  ...timestamps,
});

export const Synonym = pgTable("Synonym", {
  id: serial().primaryKey(),
  wordSlug: varchar()
    .notNull()
    .references(() => Word.slug),
  pos: varchar().notNull(),
  content: varchar().notNull(),
  transCn: varchar().notNull(),
  ...timestamps,
});

export const Translation = pgTable("Translation", {
  id: serial().primaryKey(),
  wordSlug: varchar()
    .notNull()
    .references(() => Word.slug),
  pos: varchar().notNull(),
  transCn: varchar().notNull(),
  transEn: varchar().notNull(),
  ...timestamps,
});

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
  (t) => [primaryKey({ columns: [t.userId, t.postId] })],
);

// table relations
export const UserRelations = relations(User, ({ many }) => ({
  UsersToBooks: many(UsersToBooks),
  UsersToWords: many(UsersToWords),
  UsersToPostsVote: many(UsersToPostsVote),
  Posts: many(Post),
}));

export const PostRelations = relations(Post, ({ one, many }) => ({
  User: one(User, { fields: [Post.userId], references: [User.id] }),
  Word: one(Word, { fields: [Post.wordSlug], references: [Word.slug] }),
  UsersToPostsVote: many(UsersToPostsVote),
  Posts: many(Post),
}));

export const BookRelations = relations(Book, ({ many }) => ({
  UsersToBooks: many(UsersToBooks),
  Words: many(Word),
}));

export const WordRelations = relations(Word, ({ one, many }) => ({
  Book: one(Book, {
    fields: [Word.bookSlug],
    references: [Book.slug],
  }),
  UsersToWords: many(UsersToWords),
  Cognates: many(Cognate),
  Phrases: many(Phrase),
  Sentences: many(Sentence),
  Synonyms: many(Synonym),
  Translations: many(Translation),
  Posts: many(Post),
}));

export const CognateRelations = relations(Cognate, ({ one }) => ({
  Word: one(Word, {
    fields: [Cognate.wordSlug],
    references: [Word.slug],
  }),
}));

export const PhraseRelations = relations(Phrase, ({ one }) => ({
  Word: one(Word, {
    fields: [Phrase.wordSlug],
    references: [Word.slug],
  }),
}));

export const SentenceRelations = relations(Sentence, ({ one }) => ({
  Word: one(Word, {
    fields: [Sentence.wordSlug],
    references: [Word.slug],
  }),
}));

export const SynonymRelations = relations(Synonym, ({ one }) => ({
  Word: one(Word, {
    fields: [Synonym.wordSlug],
    references: [Word.slug],
  }),
}));

export const TranslationRelations = relations(Translation, ({ one }) => ({
  Word: one(Word, {
    fields: [Translation.wordSlug],
    references: [Word.slug],
  }),
}));

export const UsersToBooksRelations = relations(UsersToBooks, ({ one }) => ({
  book: one(Book, {
    fields: [UsersToBooks.bookSlug],
    references: [Book.slug],
  }),
  user: one(User, {
    fields: [UsersToBooks.userId],
    references: [User.id],
  }),
}));

export const UsersToWordsRelations = relations(UsersToWords, ({ one }) => ({
  word: one(Word, {
    fields: [UsersToWords.wordSlug],
    references: [Word.slug],
  }),
  user: one(User, {
    fields: [UsersToWords.userId],
    references: [User.id],
  }),
}));

export const UsersToPostsVoteRelations = relations(
  UsersToPostsVote,
  ({ one }) => ({
    post: one(Post, {
      fields: [UsersToPostsVote.postId],
      references: [Post.id],
    }),
    user: one(User, {
      fields: [UsersToPostsVote.userId],
      references: [User.id],
    }),
  }),
);

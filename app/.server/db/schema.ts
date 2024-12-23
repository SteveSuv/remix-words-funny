import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// tables
export const User = pgTable("User", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull().unique(),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  avatar: varchar("avatar"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export const Verify = pgTable("Verify", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull().unique(),
  code: varchar("code"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export const Book = pgTable("Book", {
  id: serial("id").primaryKey(),
  slug: varchar("slug").notNull().unique(),
  name: varchar("name").notNull(),
  cover: varchar("cover").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export const Word = pgTable("Word", {
  id: serial("id").primaryKey(),
  bookSlug: varchar("bookSlug")
    .notNull()
    .references(() => Book.slug),
  slug: varchar("slug").notNull().unique(),
  word: varchar("word").notNull(),
  usPronounce: varchar("usPronounce").notNull(),
  ukPronounce: varchar("ukPronounce").notNull(),
  remember: varchar("remember").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export const Cognate = pgTable("Cognate", {
  id: serial("id").primaryKey(),
  wordSlug: varchar("wordSlug")
    .notNull()
    .references(() => Word.slug),
  pos: varchar("pos").notNull(),
  content: varchar("content").notNull(),
  transCn: varchar("transCn").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export const Phrase = pgTable("Phrase", {
  id: serial("id").primaryKey(),
  wordSlug: varchar("wordSlug")
    .notNull()
    .references(() => Word.slug),
  content: varchar("content").notNull(),
  transCn: varchar("transCn").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export const Sentence = pgTable("Sentence", {
  id: serial("id").primaryKey(),
  wordSlug: varchar("wordSlug")
    .notNull()
    .references(() => Word.slug),
  content: varchar("content").notNull(),
  transCn: varchar("transCn").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export const Synonym = pgTable("Synonym", {
  id: serial("id").primaryKey(),
  wordSlug: varchar("wordSlug")
    .notNull()
    .references(() => Word.slug),
  pos: varchar("pos").notNull(),
  content: varchar("content").notNull(),
  transCn: varchar("transCn").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export const Translation = pgTable("Translation", {
  id: serial("id").primaryKey(),
  wordSlug: varchar("wordSlug")
    .notNull()
    .references(() => Word.slug),
  pos: varchar("pos").notNull(),
  transCn: varchar("transCn").notNull(),
  transEn: varchar("transEn").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdateFn(() => new Date()),
});

// many-to-many tables
export const UsersToBooks = pgTable(
  "UsersToBooks",
  {
    userId: integer("userId")
      .notNull()
      .references(() => User.id),
    bookSlug: varchar("bookSlug")
      .notNull()
      .references(() => Book.slug),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.bookSlug] }),
  }),
);

export const UsersToWords = pgTable(
  "UsersToWords",
  {
    userId: integer("userId")
      .notNull()
      .references(() => User.id),
    wordSlug: varchar("wordSlug")
      .notNull()
      .references(() => Word.slug),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.wordSlug] }),
  }),
);

// table relations
export const UserRelations = relations(User, ({ many }) => ({
  UsersToBooks: many(UsersToBooks),
  UsersToWords: many(UsersToWords),
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

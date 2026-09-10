CREATE TABLE IF NOT EXISTS "User" (
  "id" serial PRIMARY KEY,
  "name" varchar NOT NULL UNIQUE,
  "email" varchar NOT NULL UNIQUE,
  "password" varchar NOT NULL,
  "avatar" varchar,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Book" (
  "id" serial PRIMARY KEY,
  "slug" varchar NOT NULL UNIQUE,
  "name" varchar NOT NULL,
  "cover" varchar NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Word" (
  "id" serial PRIMARY KEY,
  "bookSlug" varchar NOT NULL REFERENCES "Book" ("slug"),
  "slug" varchar NOT NULL UNIQUE,
  "word" varchar NOT NULL,
  "usPronounce" varchar NOT NULL,
  "ukPronounce" varchar NOT NULL,
  "remember" varchar NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Post" (
  "id" serial PRIMARY KEY,
  "content" text NOT NULL,
  "userId" integer NOT NULL REFERENCES "User" ("id"),
  "wordSlug" varchar NOT NULL REFERENCES "Word" ("slug"),
  "parentPostId" integer REFERENCES "Post" ("id"),
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Verify" (
  "id" serial PRIMARY KEY,
  "email" varchar NOT NULL UNIQUE,
  "code" varchar,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Cognate" (
  "id" serial PRIMARY KEY,
  "wordSlug" varchar NOT NULL REFERENCES "Word" ("slug"),
  "pos" varchar NOT NULL,
  "content" varchar NOT NULL,
  "transCn" varchar NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Phrase" (
  "id" serial PRIMARY KEY,
  "wordSlug" varchar NOT NULL REFERENCES "Word" ("slug"),
  "content" varchar NOT NULL,
  "transCn" varchar NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Sentence" (
  "id" serial PRIMARY KEY,
  "wordSlug" varchar NOT NULL REFERENCES "Word" ("slug"),
  "content" varchar NOT NULL,
  "transCn" varchar NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Synonym" (
  "id" serial PRIMARY KEY,
  "wordSlug" varchar NOT NULL REFERENCES "Word" ("slug"),
  "pos" varchar NOT NULL,
  "content" varchar NOT NULL,
  "transCn" varchar NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Translation" (
  "id" serial PRIMARY KEY,
  "wordSlug" varchar NOT NULL REFERENCES "Word" ("slug"),
  "pos" varchar NOT NULL,
  "transCn" varchar NOT NULL,
  "transEn" varchar NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "UsersToBooks" (
  "userId" integer NOT NULL REFERENCES "User" ("id"),
  "bookSlug" varchar NOT NULL REFERENCES "Book" ("slug"),
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("userId", "bookSlug")
);

CREATE TABLE IF NOT EXISTS "UsersToWords" (
  "userId" integer NOT NULL REFERENCES "User" ("id"),
  "wordSlug" varchar NOT NULL REFERENCES "Word" ("slug"),
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("userId", "wordSlug")
);

CREATE TABLE IF NOT EXISTS "UsersToPostsVote" (
  "userId" integer NOT NULL REFERENCES "User" ("id"),
  "postId" integer NOT NULL REFERENCES "Post" ("id"),
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("userId", "postId")
);

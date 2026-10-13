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
  "replyToUserId" integer REFERENCES "User" ("id"),
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Notice" (
  "id" serial PRIMARY KEY,
  "recipientUserId" integer NOT NULL,
  "actorUserId" integer NOT NULL,
  "type" varchar NOT NULL,
  "targetPostId" integer NOT NULL,
  "relatedPostId" integer,
  "isRead" boolean NOT NULL DEFAULT false,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "Notice_recipientUserId_User_id_fkey"
    FOREIGN KEY ("recipientUserId") REFERENCES "User" ("id"),
  CONSTRAINT "Notice_actorUserId_User_id_fkey"
    FOREIGN KEY ("actorUserId") REFERENCES "User" ("id"),
  CONSTRAINT "Notice_targetPostId_Post_id_fkey"
    FOREIGN KEY ("targetPostId") REFERENCES "Post" ("id"),
  CONSTRAINT "Notice_relatedPostId_Post_id_fkey"
    FOREIGN KEY ("relatedPostId") REFERENCES "Post" ("id")
);

CREATE TABLE IF NOT EXISTS "Verify" (
  "id" serial PRIMARY KEY,
  "email" varchar NOT NULL UNIQUE,
  "code" varchar,
  "expiresAt" timestamp NOT NULL DEFAULT now(),
  "consumedAt" timestamp,
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

CREATE INDEX IF NOT EXISTS "Cognate_wordSlug_idx" ON "Cognate" ("wordSlug");
CREATE INDEX IF NOT EXISTS "Phrase_wordSlug_idx" ON "Phrase" ("wordSlug");
CREATE INDEX IF NOT EXISTS "Sentence_wordSlug_idx" ON "Sentence" ("wordSlug");
CREATE INDEX IF NOT EXISTS "Synonym_wordSlug_idx" ON "Synonym" ("wordSlug");
CREATE INDEX IF NOT EXISTS "Translation_wordSlug_idx" ON "Translation" ("wordSlug");
CREATE INDEX IF NOT EXISTS "Post_wordSlug_id_idx"
  ON "Post" ("wordSlug", "id" DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS "Post_parentPostId_id_idx" ON "Post" ("parentPostId", "id");
CREATE INDEX IF NOT EXISTS "UsersToPostsVote_postId_userId_idx"
  ON "UsersToPostsVote" ("postId", "userId");
CREATE INDEX IF NOT EXISTS "Notice_recipient_createdAt_id_idx"
  ON "Notice" ("recipientUserId", "createdAt" DESC NULLS LAST, "id" DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS "Notice_recipient_unread_idx"
  ON "Notice" ("recipientUserId") WHERE "isRead" = false;
CREATE INDEX IF NOT EXISTS "Notice_actor_target_like_idx"
  ON "Notice" ("actorUserId", "targetPostId") WHERE "type" = 'like';

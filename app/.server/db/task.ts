import { count } from "drizzle-orm";
import { db } from ".";
import { Word } from "./schema";

// here to run some db task
const runTask = async () => {
  // total words count
  const [{ count: wordsCount }] = await db
    .select({ count: count(Word.id) })
    .from(Word);

  console.log(wordsCount);
};

runTask();

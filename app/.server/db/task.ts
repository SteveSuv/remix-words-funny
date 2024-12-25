import { db } from ".";
import { Word } from "./schema";

// here to run some db task
const runTask = async () => {
  // total words count
  const wordsCount = await db.$count(Word);
  console.log(`total words count: ${wordsCount}`);
};

runTask();

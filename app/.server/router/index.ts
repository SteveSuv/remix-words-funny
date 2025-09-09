import { t } from "../common/trpc";

// loaders
import { getAllBooks } from "./loader/getAllBooks";
import { getBookDetail } from "./loader/getBookDetail";
import { getDoneWordsOfBook } from "./loader/getDoneWordsOfBook";
import { getIsPostVote } from "./loader/getIsPostVote";
import { getIsWordDone } from "./loader/getIsWordDone";
import { getMyUserInfo } from "./loader/getMyUserInfo";
import { getPostVote } from "./loader/getPostVote";
import { getStarBooks } from "./loader/getStarBooks";
import { getStudyCalendar } from "./loader/getStudyCalendar";
import { getUnDoneWordsOfBook } from "./loader/getUnDoneWordsOfBook";
import { getWordCognates } from "./loader/getWordCognates";
import { getWordComments } from "./loader/getWordComments";
import { getWordDetail } from "./loader/getWordDetail";
import { getWordPhrases } from "./loader/getWordPhrases";
import { getWordSentences } from "./loader/getWordSentences";
import { getWordsOfBook } from "./loader/getWordsOfBook";
import { getWordsOfKeyword } from "./loader/getWordsOfKeyword";
import { getWordSynonyms } from "./loader/getWordSynonyms";
import { getWordTranslations } from "./loader/getWordTranslations";

// actions
import { doneWord } from "./action/doneWord";
import { sendComment } from "./action/sendComment";
import { sendVerifyCode } from "./action/sendVerifyCode";
import { signIn } from "./action/signIn";
import { signOut } from "./action/signOut";
import { signUp } from "./action/signUp";
import { starBook } from "./action/starBook";
import { unDoneWord } from "./action/unDoneWord";
import { unStarBook } from "./action/unStarBook";
import { unVotePost } from "./action/unVotePost";
import { updatePassword } from "./action/updatePassword";
import { votePost } from "./action/votePost";

const loader = t.router({
  getMyUserInfo,
  getAllBooks,
  getBookDetail,
  getWordDetail,
  getWordsOfKeyword,
  getWordCognates,
  getWordPhrases,
  getWordSentences,
  getWordSynonyms,
  getWordTranslations,
  getWordsOfBook,
  getIsWordDone,
  getStarBooks,
  getDoneWordsOfBook,
  getUnDoneWordsOfBook,
  getStudyCalendar,
  getWordComments,
  getPostVote,
  getIsPostVote,
});

const action = t.router({
  doneWord,
  unDoneWord,
  sendVerifyCode,
  signIn,
  signOut,
  signUp,
  updatePassword,
  starBook,
  unStarBook,
  sendComment,
  votePost,
  unVotePost,
});

export const appRouter = t.router({
  loader,
  action,
});

export type AppRouter = typeof appRouter;

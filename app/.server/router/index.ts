import { orpc } from "../common/orpc";

// loaders
import { getAllBooks } from "./loader/getAllBooks";
import { getBookDetail } from "./loader/getBookDetail";
import { getDoneWordsOfBook } from "./loader/getDoneWordsOfBook";
import { getIsWordDone } from "./loader/getIsWordDone";
import { getMyUserInfo } from "./loader/getMyUserInfo";
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
import { sendComment } from "./action/sendComment";
import { sendVerifyCode } from "./action/sendVerifyCode";
import { setPostVote } from "./action/setPostVote";
import { setStarBooks } from "./action/setStarBooks";
import { setWordDone } from "./action/setWordDone";
import { signIn } from "./action/signIn";
import { signOut } from "./action/signOut";
import { signUp } from "./action/signUp";
import { updatePassword } from "./action/updatePassword";

const loader = orpc.router({
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
});

const action = orpc.router({
  sendVerifyCode,
  signIn,
  signOut,
  signUp,
  updatePassword,
  setStarBooks,
  setWordDone,
  sendComment,
  setPostVote,
});

export const router = orpc.router({ loader, action });

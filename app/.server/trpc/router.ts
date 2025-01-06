import { t } from "../trpc";

// loaders
import { getAllBooks } from "./loader/getAllBooks";
import { getMyUserInfo } from "./loader/getMyUserInfo";
import { getBookDetail } from "./loader/getBookDetail";
import { getWordDetail } from "./loader/getWordDetail";
import { getWordsOfBook } from "./loader/getWordsOfBook";
import { getWordsOfKeyword } from "./loader/getWordsOfKeyword";
import { getWordCognates } from "./loader/getWordCognates";
import { getWordPhrases } from "./loader/getWordPhrases";
import { getWordSentences } from "./loader/getWordSentences";
import { getWordSynonyms } from "./loader/getWordSynonyms";
import { getWordTranslations } from "./loader/getWordTranslations";
import { getIsWordDone } from "./loader/getIsWordDone";
import { getIsBookStar } from "./loader/getIsBookStar";
import { getDoneWordsOfBook } from "./loader/getDoneWordsOfBook";
import { getUnDoneWordsOfBook } from "./loader/getUnDoneWordsOfBook";
import { getStudyCalendar } from "./loader/getStudyCalendar";
import { getWordComments } from "./loader/getWordComments";
import { getPostVote } from "./loader/getPostVote";
import { getIsPostVote } from "./loader/getIsPostVote";

// actions
import { doneWord } from "./action/doneWord";
import { unDoneWord } from "./action/unDoneWord";
import { sendVerifyCode } from "./action/sendVerifyCode";
import { signIn } from "./action/signIn";
import { signOut } from "./action/signOut";
import { signUp } from "./action/signUp";
import { updatePassword } from "./action/updatePassword";
import { starBook } from "./action/starBook";
import { unStarBook } from "./action/unStarBook";
import { sendComment } from "./action/sendComment";
import { votePost } from "./action/votePost";
import { unVotePost } from "./action/unVotePost";

export const appRouter = t.router({
  loader: t.router({
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
    getIsBookStar,
    getDoneWordsOfBook,
    getUnDoneWordsOfBook,
    getStudyCalendar,
    getWordComments,
    getPostVote,
    getIsPostVote,
  }),
  action: t.router({
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
  }),
});

export type AppRouter = typeof appRouter;

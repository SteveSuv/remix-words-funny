import { and, count, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { Notice, Post, User, Word } from "~/.server/db/schema";

const NOTICE_PAGE_SIZE = 20;

const getNoticesPagePrepare = db
  .select()
  .from(Notice)
  .where(eq(Notice.recipientUserId, sql.placeholder("userId")))
  .orderBy(desc(Notice.createdAt), desc(Notice.id))
  .limit(sql.placeholder("limit"))
  .offset(sql.placeholder("offset"))
  .prepare("getNotices.page");

const getUnreadNoticeCountPrepare = db
  .select({ unreadCount: count() })
  .from(Notice)
  .where(
    and(
      eq(Notice.recipientUserId, sql.placeholder("userId")),
      eq(Notice.isRead, false),
    ),
  )
  .prepare("getNotices.unreadCount");

const getNoticeActorsPrepare = db
  .select({ id: User.id, name: User.name, avatar: User.avatar })
  .from(User)
  .where(sql`${User.id} = ANY(${sql.placeholder("actorIds")}::integer[])`)
  .prepare("getNotices.actors");

const getNoticePostsPrepare = db
  .select({
    id: Post.id,
    content: Post.content,
    wordSlug: Post.wordSlug,
    parentPostId: Post.parentPostId,
  })
  .from(Post)
  .where(sql`${Post.id} = ANY(${sql.placeholder("postIds")}::integer[])`)
  .prepare("getNotices.posts");

const getNoticeWordsPrepare = db
  .select({ slug: Word.slug, word: Word.word })
  .from(Word)
  .where(sql`${Word.slug} = ANY(${sql.placeholder("wordSlugs")}::varchar[])`)
  .prepare("getNotices.words");

export const getNotices = p.auth
  .input(z.object({ cursor: z.number().int().min(0).default(0) }))
  .handler(async ({ context: { userId }, input: { cursor } }) => {
    const [rows, unreadRows] = await Promise.all([
      getNoticesPagePrepare.execute({
        userId,
        limit: NOTICE_PAGE_SIZE + 1,
        offset: NOTICE_PAGE_SIZE * cursor,
      }),
      getUnreadNoticeCountPrepare.execute({ userId }),
    ]);

    const notices = rows.slice(0, NOTICE_PAGE_SIZE);
    const nextCursor = rows.length > NOTICE_PAGE_SIZE ? cursor + 1 : undefined;
    const actorIds = [
      ...new Set(notices.map(({ actorUserId }) => actorUserId)),
    ];
    const postIds = [
      ...new Set(
        notices.flatMap(({ targetPostId, relatedPostId }) =>
          relatedPostId === null
            ? [targetPostId]
            : [targetPostId, relatedPostId],
        ),
      ),
    ];

    const [actors, posts] = await Promise.all([
      actorIds.length
        ? getNoticeActorsPrepare.execute({ actorIds })
        : Promise.resolve([]),
      postIds.length
        ? getNoticePostsPrepare.execute({ postIds })
        : Promise.resolve([]),
    ]);
    const wordSlugs = [...new Set(posts.map(({ wordSlug }) => wordSlug))];
    const words = wordSlugs.length
      ? await getNoticeWordsPrepare.execute({ wordSlugs })
      : [];

    const actorById = new Map(actors.map((actor) => [actor.id, actor]));
    const postById = new Map(posts.map((post) => [post.id, post]));
    const wordBySlug = new Map(words.map((word) => [word.slug, word.word]));
    const noticeItems = notices.flatMap((Notice) => {
      const Actor = actorById.get(Notice.actorUserId);
      const TargetPost = postById.get(Notice.targetPostId);
      if (!Actor || !TargetPost) return [];

      return [
        {
          Notice,
          Actor,
          TargetPost,
          RelatedPost: Notice.relatedPostId
            ? (postById.get(Notice.relatedPostId) ?? null)
            : null,
          word: wordBySlug.get(TargetPost.wordSlug) ?? TargetPost.wordSlug,
        },
      ];
    });

    return {
      notices: noticeItems,
      unreadCount: unreadRows[0]?.unreadCount ?? 0,
      nextCursor,
    };
  });

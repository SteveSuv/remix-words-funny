import { Card, Separator } from "@heroui/react";
import dayjs from "dayjs";
import type { ICommentItem } from "~/common/types";
import { CommentVoteButton } from "./CommentVoteButton";
import { UserAvatar } from "~/components/common/UserAvatar";

export function WordCommentItem({
  comment: {
    User: { name },
    Post: { content, updatedAt, id: postId },
  },
}: {
  comment: ICommentItem;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <div className="flex w-full flex-1 flex-col justify-center gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserAvatar name={name} size={30} />
              <div className="flex flex-col">
                <div className="font-medium">{name}</div>
                <small className="text-muted">
                  {dayjs(updatedAt).format("YYYY-MM-DD HH:mm")}
                </small>
              </div>
            </div>
            <CommentVoteButton postId={postId} />
          </div>

          <Card variant="secondary">
            <Card.Content>
              <div className="wrap-break-word">{content}</div>
            </Card.Content>
          </Card>

          <div className="my-2">
            <Separator />
          </div>
        </div>
      </div>
    </div>
  );
}

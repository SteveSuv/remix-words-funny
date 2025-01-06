import dayjs from "dayjs";
import { UserAvatar } from "./UserAvatar";
import { ICommentItem } from "~/common/types";
import { Divider } from "@nextui-org/react";
import { CommentVoteButton } from "./CommentVoteButton";

export const WordCommentItem = ({
  comment: {
    User: { name },
    Post: { content, updatedAt, id: postId },
  },
}: {
  comment: ICommentItem;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <div className="flex w-full flex-1 flex-col justify-center gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserAvatar name={name} size={20} />
              <div className="text-foreground-400">{name}</div>
            </div>
            <small className="text-foreground-400">
              {dayjs(updatedAt).format("YYYY-MM-DD HH:mm")}
            </small>
          </div>

          <div className="break-words">{content}</div>

          <div className="flex items-center">
            <CommentVoteButton postId={postId} />
          </div>

          <Divider className="my-2" />
        </div>
      </div>
    </div>
  );
};

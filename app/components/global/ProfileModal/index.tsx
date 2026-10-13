import { Modal, Skeleton, useOverlayState } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { isProfileModalOpenAtom, profileUserIdAtom } from "~/common/store";
import { orpc } from "~/common/orpcClient";
import dayjs from "dayjs";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { StudyCalendar } from "./StudyCalendar";
import { UserAvatar } from "~/components/common/UserAvatar";

export function ProfileModal() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useAtom(
    isProfileModalOpenAtom,
  );

  const { myUserInfo } = useMyUserInfo();
  const selectedUserId = useAtomValue(profileUserIdAtom);
  const profileUserId = selectedUserId ?? myUserInfo?.id;
  const profileQuery = useQuery(
    orpc.loader.getStudyCalendar.queryOptions({
      input: { userId: profileUserId ?? 0 },
      enabled: isProfileModalOpen && profileUserId !== undefined,
      staleTime: 0,
    }),
  );
  const state = useOverlayState({
    isOpen: isProfileModalOpen,
    onOpenChange: setIsProfileModalOpen,
  });

  if (!profileUserId) return null;

  const profile = profileQuery.data?.profile;

  return (
    <Modal state={state}>
      <Modal.Backdrop variant="blur">
        <Modal.Container placement="center" size="lg">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>个人主页</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-4 flex items-center gap-2">
                {profile ? (
                  <>
                    <UserAvatar
                      isClickable={false}
                      name={profile.name}
                      userId={profile.id}
                    />
                    <div className="flex flex-col justify-center">
                      <div className="font-medium text-foreground">
                        {profile.name}
                      </div>
                      <small className="text-muted">
                        注册于 {dayjs(profile.createdAt).format("YYYY-MM-DD")}
                      </small>
                    </div>
                  </>
                ) : (
                  <>
                    <Skeleton className="size-12 rounded-full" />
                    <Skeleton className="h-4 w-24 rounded-sm" />
                  </>
                )}
              </div>
              {profile && (
                <StudyCalendar
                  studyCalendar={profileQuery.data?.studyCalendar ?? []}
                  isFetching={profileQuery.isFetching}
                />
              )}
              {!profile && profileQuery.isError && (
                <div className="text-muted py-8 text-center">主页不可用</div>
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

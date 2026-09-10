import { Tabs } from "@heroui/react";
import type { Key } from "react";
import { useAtom, useSetAtom } from "jotai";
import { isSignInModalOpenAtom, listTabAtom } from "~/common/store";
import { ListTabType } from "~/common/types";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";

const tabs = [
  { key: ListTabType.ALL, label: "全部" },
  { key: ListTabType.DONE, label: "已掌握" },
  { key: ListTabType.UNDONE, label: "未掌握" },
];

export function ListTabs() {
  const [listTab, setListTab] = useAtom(listTabAtom);
  const setIsSignInModalOpen = useSetAtom(isSignInModalOpenAtom);

  const { isLogin } = useMyUserInfo();

  return (
    <Tabs
      selectedKey={listTab}
      onSelectionChange={(key: Key) => {
        const nextTab = key as ListTabType;

        if (!isLogin && nextTab !== ListTabType.ALL) {
          setIsSignInModalOpen(true);
          return;
        }

        setListTab(nextTab);
      }}
    >
      <Tabs.ListContainer>
        <Tabs.List>
          {tabs.map(({ key, label }) => (
            <Tabs.Tab id={key} key={key} className="whitespace-nowrap">
              {label}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
}

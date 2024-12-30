import { Tab, Tabs } from "@nextui-org/react";
import { atom, useAtom } from "jotai";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";

export enum ListTabType {
  ALL = "ALL",
  DONE = "DONE",
  UNDONE = "UNDONE",
}

export const listTabAtom = atom(ListTabType.ALL);

export const ListTabs = () => {
  const [listTab, setListTab] = useAtom(listTabAtom);

  const { isLogin } = useMyUserInfo();

  const tabs = [
    { key: ListTabType.ALL, label: "全部" },
    { key: ListTabType.DONE, label: "已掌握" },
    { key: ListTabType.UNDONE, label: "未掌握" },
  ];

  return (
    <Tabs
      aria-label="tabs"
      selectedKey={listTab}
      defaultSelectedKey={ListTabType.ALL}
      disabledKeys={isLogin ? [] : [ListTabType.DONE, ListTabType.UNDONE]}
      onSelectionChange={(key) => {
        setListTab(key as ListTabType);
      }}
    >
      {tabs.map(({ key, label }) => {
        return <Tab key={key} title={label} />;
      })}
    </Tabs>
  );
};

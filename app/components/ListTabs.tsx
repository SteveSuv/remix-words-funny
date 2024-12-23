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
    { key: ListTabType.ALL, label: "All" },
    { key: ListTabType.DONE, label: "Done" },
    { key: ListTabType.UNDONE, label: "UnDone" },
  ].slice(0, isLogin ? 3 : 1);

  return (
    <Tabs
      aria-label="tabs"
      selectedKey={listTab}
      defaultSelectedKey={ListTabType.ALL}
      onSelectionChange={(key) => {
        setListTab(key as ListTabType);
      }}
    >
      {tabs.map((item) => {
        return <Tab key={item.key} title={item.label} />;
      })}
    </Tabs>
  );
};

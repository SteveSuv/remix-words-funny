import { Tab, Tabs } from "@heroui/react";
import { useAtom } from "jotai";
import { listTabAtom } from "~/common/store";
import { ListTabType } from "~/common/types";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";

export const ListTabs = () => {
  const [listTab, setListTab] = useAtom(listTabAtom);

  const { isLogin } = useMyUserInfo();

  const tabs = [
    { key: ListTabType.ALL, label: "全部", disabled: false },
    { key: ListTabType.DONE, label: "已掌握", disabled: !isLogin },
    { key: ListTabType.UNDONE, label: "未掌握", disabled: !isLogin },
  ];

  return (
    <Tabs
      aria-label="tabs"
      selectedKey={listTab}
      defaultSelectedKey={ListTabType.ALL}
      onSelectionChange={(key) => {
        setListTab(key as ListTabType);
      }}
    >
      {tabs.map(({ key, label, disabled }) => (
        <Tab
          key={key}
          title={label}
          isDisabled={disabled}
          titleValue={disabled ? "请先登录" : ""}
        />
      ))}
    </Tabs>
  );
};

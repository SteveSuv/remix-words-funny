import { WordsPanelHeader } from "./Header";
import { WordsPanelList } from "./List";

export function WordsPanel() {
  return (
    <div className="flex h-screen w-full flex-col">
      <WordsPanelHeader />
      <WordsPanelList />
    </div>
  );
}

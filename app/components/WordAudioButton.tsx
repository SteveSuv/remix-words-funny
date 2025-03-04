import { Button } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { LuIcon } from "./LuIcon";
import { PauseCircle, PlayCircle } from "lucide-react";
import { useAtomValue } from "jotai";
import { wordDetailSlugAtom } from "./WordDetailPanel";

export const WordAudioButton = ({ word }: { word: string }) => {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
  }, [wordDetailSlug]);

  return (
    <>
      <Button
        isIconOnly
        isDisabled={isPlaying}
        variant="flat"
        size="sm"
        onPress={() => {
          audioRef.current?.play();
        }}
      >
        <LuIcon
          className="text-primary"
          icon={isPlaying ? PauseCircle : PlayCircle}
        />
      </Button>
      <audio
        hidden
        ref={audioRef}
        onPlay={() => {
          setIsPlaying(true);
        }}
        onEnded={() => {
          setIsPlaying(false);
        }}
        src={`http://dict.youdao.com/dictvoice?type=0&audio=${word.trim().toLowerCase()}`}
      />
    </>
  );
};

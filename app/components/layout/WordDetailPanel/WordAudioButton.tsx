import { Button } from "@heroui/react";
import { useAtomValue } from "jotai";
import { PauseCircle, PlayCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { wordDetailSlugAtom } from "~/common/store";
import { LuIcon } from "~/components/common/LuIcon";

export function WordAudioButton({ word }: { word: string }) {
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
        variant="outline"
        size="sm"
        onPress={() => {
          audioRef.current?.play();
        }}
      >
        <LuIcon icon={isPlaying ? PauseCircle : PlayCircle} />
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
}

import { Button } from "@nextui-org/react";
import { useRef, useState } from "react";
import { LuIcon } from "./LuIcon";
import { PauseCircle, PlayCircle } from "lucide-react";

export const WordAudioButton = ({ word }: { word: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

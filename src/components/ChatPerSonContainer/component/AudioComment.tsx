import { FC, useEffect, useRef, useState } from "react";
import {
  BiPauseCircle,
  BiDotsHorizontalRounded,
  BiPlayCircle,
} from "react-icons/bi";
import { LoadingDot } from "../../loading";
import { coverTimeMS } from "../util";
import { cn } from "../../../servies/utils";

interface AudioCommentProps {
  link: string;
  className?: string;
}
const AudioComment: FC<AudioCommentProps> = ({ link, className }) => {
  const [isPlay, setIsplay] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timeRef = useRef<HTMLTimeElement>(null);
  const handleAudio = (isPlayed: boolean) => {
    if (isPlayed) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
    setIsplay(isPlayed);
  };
  useEffect(() => {
    let idTimeout: any;
    if (audioRef.current) {
      audioRef.current.addEventListener("loadeddata", function () {
        if (timeRef.current) {
          if (this.duration * 0 == 0) {
            timeRef.current.innerHTML = coverTimeMS(this.duration);
          } else {
            timeRef.current.innerHTML = "00:??";
          }
        }
      });
      audioRef.current.addEventListener("ended", () => {
        handleAudio(false);
      });
      audioRef.current.addEventListener("timeupdate", function () {
        if (timeRef.current) {
          timeRef.current.innerHTML = coverTimeMS(this.currentTime) || "00:00";
        }
      });
    }
    return () => {
      clearTimeout(idTimeout);
    };
  }, []);

  return (
    <div className={cn("flex items-center gap-2 h-12 px-4", className)}>
      <button className="text-3xl" onClick={() => handleAudio(!isPlay)}>
        {isPlay ? <BiPauseCircle /> : <BiPlayCircle />}
      </button>
      {isPlay ? (
        <LoadingDot />
      ) : (
        <span className="text-5xl w-6 h-11 items-center flex">
          <BiDotsHorizontalRounded />
        </span>
      )}

      <time ref={timeRef} className="text-sm font-semibold">
        {coverTimeMS(audioRef.current?.currentTime || 0)}
      </time>
      <audio ref={audioRef} className="hidden" src={link}></audio>
    </div>
  );
};

export default AudioComment;

import React, { useRef, useState } from "react";

import YouTube from "react-youtube";

import "./youtube.scss";
import { VideoItem } from "../../../servies/streamchatbox/openai-stream";
import moment from "moment";

import { LoadingDot } from "../../loading";
import { BiTime, BiXCircle } from "react-icons/bi";
import { handleStopPropagation } from "../../../servies/utils";
interface yotubeContaineProps {
  listVideo: VideoItem[];
}
const YotubeContainer: React.FC<yotubeContaineProps> = ({ listVideo = [] }) => {
  const [idCurrent, setIsCurrent] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);

  const handleSettingMenuOpen = () => {
    if (modalRef.current) {
      if (
        !modalRef.current.className.includes("hidden__effect--youtube-modal")
      ) {
        setIsCurrent("");
      }

      modalRef.current.classList.toggle("hidden__effect--youtube-modal");
    }
  };
  const handleChangeVideo = (id: string) => {
    setIsCurrent(id);
    handleSettingMenuOpen();
  };
  return (
    <section className="grid xl:grid-cols-3  sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-2 w-full flex-1">
      {listVideo && listVideo.length > 0 ? (
        listVideo.map((video) => (
          <figure
            className="cursor-pointer mt-4 overflow-hidden"
            key={video.id}
            onClick={() => handleChangeVideo(video.id)}
          >
            <img
              src={video.thumbnail.medium.url}
              alt={video.title}
              className="w-full object-cover rounded-lg hover:rounded-none hover:scale-x-110  ease-out duration-200"
            />
            <h6>
              <span className="line-clamp-2 text-sm mt-2"> {video.title}</span>
            </h6>
            <p className="flex gap-2 items-center text-xs ">
              <span className="animate-spin inline-block">
                <BiTime />
              </span>
              {moment(video.publishTime, "YYYYMMDD").fromNow()}
            </p>
          </figure>
        ))
      ) : (
        <>
          <LoadingDot />
        </>
      )}
      <div
        ref={modalRef}
        onClick={handleSettingMenuOpen}
        className="fixed container mx-auto ease-in duration-200 hidden__effect--youtube-modal inset-0 bg-black/80 z-50 flex  items-center justify-center"
      >
        <div
          onClick={handleStopPropagation}
          className="lg:w-[800px]  md:w-[600px]  sm:w-[600px]  w-full mx-2 h-screen relative top-[36%] sm:top-[25%]  lg:top-[15%]"
        >
          <button
            title="Đóng của sổ"
            onClick={handleSettingMenuOpen}
            className="absolute z-10 sm:-top-8 sm:-right-6  -top-6 right-0 "
          >
            <BiXCircle
              className="text-primary-hover cursor-pointer"
              fontSize={40}
            />
          </button>
          <div className="youtube-player">
            <YouTube
              loading="lazy"
              videoId={idCurrent}
              opts={{
                playerVars: {
                  origin: "https://www.youtube.com",
                  autoplay: 1,
                },
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default YotubeContainer;

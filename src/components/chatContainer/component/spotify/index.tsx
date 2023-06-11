import AudioPlayer from "react-h5-audio-player";
import { useDispatch, useSelector } from "react-redux";
import "react-h5-audio-player/lib/styles.css";
import { AppDispatch, RootState } from "../../../../redux";
import { BiXCircle } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarGroup } from "@mui/material";
import { updateStatusModalSpotify } from "../../../../redux/Slice/SpotifySlice";
import { zingAxios } from "../../../../servies/streamchatbox/openai-stream";
import { IArtists, IMusic } from "./spotify.contant";
import "./spotify.scss";
import { ToastNotify } from "../../../../servies/utils";
// import { useMutation } from "react-query";
import { RiHeartsFill } from "react-icons/ri";
import SpotifyItem from "./SpotifyItem";
import { nanoid } from "@reduxjs/toolkit";
import { LoaddingOverLay } from "../../../loading";
interface Isong {
  artists: IArtists[];
  like: number;
  duration: number;
  artistsNames: string;
  thumbnail: string;
  thumbnailM: string;
  title: string;
}
interface Ilyrics {
  text: "string";
  endTime: number;
  startTime: number;
}
function handleSetHtml<T extends HTMLElement>(element: T, text: string) {
  if (element) {
    element.innerHTML = text;
  }
}
function handleHidden<T extends HTMLElement>(element: T, isHidden: boolean) {
  if (element) {
    if (isHidden) {
      element.classList.add("hidden");
    } else {
      element.classList.remove("hidden");
    }
  }
}

const SpotifyModal = () => {
  const { key, type } = useSelector((state: RootState) => state.spotifyStore);
  const [song, setSong] = useState<Isong>();
  const [urlSong, setUrlSong] = useState<string>("");
  const [listLyric, setListLyric] = useState<Ilyrics[]>([]);
  const [playList, setPlayList] = useState<IMusic[]>([]);
  const [artist, setArtist] = useState<IArtists[]>([]);
  const dispacth: AppDispatch = useDispatch();

  useEffect(() => {
    if (type == "song") {
      (async () => {
        try {
          const [lyricts, link, songinfo] = await Promise.all([
            zingAxios.get("lyric", { params: { id: key } }),
            zingAxios.get("song", { params: { id: key } }),
            zingAxios.get("infosong", { params: { id: key } }),
          ]);
          if (link.data.err) {
            throw new Error(link.data.msg);
          }
          if (!link.data?.data["128"]) {
            throw new Error("Chỉ dành cho tài khoản vip");
          }
          setUrlSong(link.data.data["128"]);
          setSong(songinfo.data.data);
          if (lyricts.data.data.sentences) {
            const HandleWorks = lyricts.data.data.sentences.map((item: any) => {
              const listText = item.words
                .map((item: { data: string }) => item.data)
                .join(" ");
              const startTime = item.words[0].startTime;
              const endTime = item.words[item.words.length - 1].endTime;

              return { text: listText, startTime, endTime };
            });
            setListLyric(HandleWorks);
          } else {
            if (lyricRef.current) {
              lyricRef.current.classList.add("hidden");
            }
            setListLyric([]);
          }
        } catch (err: { message: string } | any) {
          ToastNotify(err.message).info();
          dispacth(updateStatusModalSpotify(false));
        }
      })();
    } else {
      //type=="artist"

      zingAxios.get("detailplaylist", { params: { id: key } }).then((data) => {
        console.log(data.data);
        setPlayList(data.data?.data?.song?.items || []);
        setArtist(data.data?.data?.artists || []);
      });
    }
  }, [key, type]);
  let idPrevs = 0;
  const handlePlayting = (e: Event | any) => {
    if (lyricRef.current) {
      if (!e) return "";
      const timeCurrent = Math.floor(e.target.currentTime * 1000);
      if (listLyric && listLyric.length > 0) {
        const result = listLyric.findIndex(
          (ly) => ly.endTime > timeCurrent && ly.startTime < timeCurrent
        );
        console.log(idPrevs, result);
        if (result > 0) {
          const elementssOld =
            document.getElementById(`current${idPrevs.toString()}`) || null;
          const elementssNew =
            document.getElementById(`current${result.toString()}`) || null;

          if (elementssOld) {
            elementssOld.style.color = "#ffffff";
          }
          if (elementssNew) {
            elementssNew.style.color = "#ffff00";
            elementssNew.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });
          }
          idPrevs = result;
          handleSetHtml<HTMLDivElement>(
            lyricRef.current,
            listLyric[result]?.text || ""
          );
        }
      }
    }
  };
  const handleVideoEnded = () => {
    handleSetHtml<HTMLDivElement>(lyricRef.current, "Đã hết!");
  };
  const lyricRef = useRef<HTMLDivElement | any>(null);
  const lyricContainerRef = useRef<HTMLDivElement | any>(null);

  const AudioRef = useRef<HTMLAudioElement | any>(null);
  if (!song && playList.length <= 0) {
    return <LoaddingOverLay />;
  }
  return (
    <article
      onClick={(e) => e.stopPropagation()}
      className="lg:min-w[860px] fixed inset-0 md:min-w-[740px]  bg-black p-4 sm:min-w[650px] w-[95%]  mx-auto min-w-[320px] "
    >
      <button
        onClick={() => dispacth(updateStatusModalSpotify(false))}
        className=" absolute top-3 right-3 text-4xl hover:text-red-600"
      >
        <BiXCircle />
      </button>

      {song && type == "song" && urlSong && (
        <section>
          <figure className="flex sm:flex-row flex-col gap-4 sm:items-center  py-8  sm:min-h-[600px] min-h-[300px] sm:justify-around ">
            <div className="h-full hidden md:block">
              <img
                src={song.thumbnailM}
                className="rounded-lg"
                alt={song.title}
              />
              <h2 className="text-center font-bold mt-2">
                {song.artists[0].name}
              </h2>
              <p className="text-center text-xs flex gap-1 justify-center">
                <RiHeartsFill /> {song.like.toLocaleString("en-vi")}
              </p>
            </div>
            <figcaption className="text-left flex justify-start items-center flex-col">
              <h6 className="mb-4">
                <span className="text-gray-400 text-sm">Bài hát :</span>{" "}
                {song.title}
              </h6>
              {song?.artists && (
                <div className="w-fit flex items-center gap-2 ">
                  {song.artists.length < 2 ? (
                    <Avatar
                      key={song.artists[0].id}
                      className="sm:w-4 sm:h-4 w-2 h-2 "
                      alt={song.artists[0].name}
                      src={song.artists[0].thumbnail}
                    />
                  ) : (
                    <AvatarGroup max={song.artists?.length || 0}>
                      {song.artists?.length > 0 &&
                        song.artists.map((item) => (
                          <Avatar
                            key={item.id}
                            className="sm:w-4 sm:h-4 w-2 h-2 "
                            alt={item.name}
                            src={item.thumbnail}
                          />
                        ))}
                    </AvatarGroup>
                  )}
                  <span className="text-sm"> {song.artistsNames}</span>
                </div>
              )}
              <div
                ref={lyricContainerRef}
                className="bg-image-music  hidden bg-center bg-cover flex items-center justify-center text-center"
              >
                <div
                  ref={lyricRef}
                  className="w-64 my-4 h-64  p-8  flex items-center justify-center text-center "
                >
                  {song && song.title}
                </div>
              </div>
            </figcaption>
            {listLyric?.length > 0 && (
              <ul className="overflow-y-auto  md:block md:max-h-[400px] text-center max-h-[100px]  sm:max-h-[300px]">
                {listLyric.map((text, index) => (
                  <li id={"current" + index} key={text.startTime}>
                    {text.text}
                  </li>
                ))}
              </ul>
            )}
          </figure>

          {song && urlSong && (
            <div className="absolute bottom-2 rounded-lg right-0 w-full">
              <AudioPlayer
                autoPlay
                onEnded={handleVideoEnded}
                onPause={() => {
                  handleHidden(lyricContainerRef.current, true);
                }}
                onPlay={() => handleHidden(lyricContainerRef.current, false)}
                ref={AudioRef}
                onLoadStart={() =>
                  handleSetHtml<HTMLDivElement>(lyricRef.current, song?.title)
                }
                onListen={handlePlayting}
                preload="metadata"
                src={urlSong}
              />
            </div>
          )}
        </section>
      )}
      <div className="overflow-y-auto max-h-[80vh]">
        {artist &&
          type == "artist" &&
          playList.length > 0 &&
          playList.map((music) => (
            <SpotifyItem key={nanoid()} items={music} artists={artist} />
          ))}
      </div>
    </article>
  );
};

export default SpotifyModal;

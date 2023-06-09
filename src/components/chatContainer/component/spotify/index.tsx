import AudioPlayer from "react-h5-audio-player";
import { useDispatch, useSelector } from "react-redux";
import "react-h5-audio-player/lib/styles.css";
import { AppDispatch, RootState } from "../../../../redux";
import { BiXCircle } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarGroup } from "@mui/material";
import { updateStatusModalSpotify } from "../../../../redux/Slice/SpotifySlice";
import { zingAxios } from "../../../../servies/streamchatbox/openai-stream";
import { IArtists } from "./spotify.contant";
import "./spotify.scss";
import { ToastNotify } from "../../../../servies/utils";
// import { useMutation } from "react-query";
import { RiHeartsFill } from "react-icons/ri";
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
const SpotifyModal = () => {
  const { key, type } = useSelector((state: RootState) => state.spotifyStore);
  const [song, setSong] = useState<Isong>();
  const [urlSong, setUrlSong] = useState<string>("");
  const [listLyric, setListLyric] = useState<Ilyrics[]>([]);

  const dispacth: AppDispatch = useDispatch();
  // const mutation =useMutation()
  useEffect(() => {
    if (type == "song") {
      (async () => {
        const [lyricts, link, songinfo] = await Promise.all([
          zingAxios.get("lyric", { params: { id: key } }),
          zingAxios.get("song", { params: { id: key } }),
          zingAxios.get("infosong", { params: { id: key } }),
        ]);
        if (link.data.err) {
          return ToastNotify(link.data.msg).info();
        }
        if (!link.data?.data["128"]) {
          return ToastNotify("Hệ thống đang bị lỗi !").info();
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
      })();
    } else {
      //type=="artist"
      zingAxios.get("detailplaylist", { params: { id: key } }).then((data) => {
        console.log(data);
      });
    }
  }, [key, type]);

  const handlePlayting = (e: Event | any) => {
    if (lyricRef.current) {
      if (!e) return "";
      const timeCurrent = Math.floor(e.target.currentTime * 1000);
      if (listLyric && listLyric.length > 0) {
        const result = listLyric.find(
          (ly) => ly.endTime > timeCurrent && ly.startTime < timeCurrent
        );
        handleSetHtml<HTMLDivElement>(lyricRef.current, result?.text || "");
      }
    }
  };
  const handleVideoEnded = () => {
    handleSetHtml<HTMLDivElement>(lyricRef.current, "Đã hết!");
  };
  const lyricRef = useRef<HTMLDivElement | any>(null);
  const AudioRef = useRef<HTMLAudioElement | any>(null);
  console.log(song);
  return (
    <article
      onClick={(e) => e.stopPropagation()}
      className="lg:min-w[860px] relative md:min-w-[740px]  bg-black p-4 sm:min-w[650px] w-full min-w-[320px] "
    >
      <button
        onClick={() => dispacth(updateStatusModalSpotify(false))}
        className=" absolute -top-3 -right-3 text-3xl hover:text-red-600"
      >
        <BiXCircle />
      </button>
      {song && urlSong && (
        <section>
          <figure className="flex gap-4 items-start">
            <div>
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
            <figcaption className="text-left flex justify-start flex-col">
              <h6 className="mb-2">
                <span className="text-gray-400 text-sm">Bài hát :</span>{" "}
                {song.title}
              </h6>
              {song?.artists && (
                <div className="w-fit flex items-center gap-2">
                  {song.artists.length < 2 ? (
                    <Avatar
                      key={song.artists[0].id}
                      className="w-4 h-4 "
                      alt={song.artists[0].name}
                      src={song.artists[0].thumbnail}
                    />
                  ) : (
                    <AvatarGroup max={song.artists?.length || 0}>
                      {song.artists?.length > 0 &&
                        song.artists.map((item) => (
                          <Avatar
                            key={item.id}
                            className="w-4 h-4 "
                            alt={item.name}
                            src={item.thumbnail}
                          />
                        ))}
                    </AvatarGroup>
                  )}
                  {song.artists?.length > 0 &&
                    song.artists.map((item) => (
                      <span key={item.id} className="text-xs">
                        {item.name}
                      </span>
                    ))}
                </div>
              )}
              <div className="bg-image-music  bg-center bg-cover flex items-center justify-center text-center">
                <div
                  ref={lyricRef}
                  className="  w-64 my-4 h-64 p-8  flex items-center justify-center text-center "
                >
                  {song && song.title}
                </div>
              </div>
            </figcaption>
          </figure>

          {song && urlSong && (
            <AudioPlayer
              onEnded={handleVideoEnded}
              ref={AudioRef}
              onLoadStart={() =>
                handleSetHtml<HTMLDivElement>(lyricRef.current, song?.title)
              }
              onListen={handlePlayting}
              preload="metadata"
              src={urlSong}
            />
          )}
        </section>
      )}
    </article>
  );
};

export default SpotifyModal;

import { FC } from "react";
import { Spotify } from "./spotify.contant";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux";
import {
  updateLinkSpotify,
  updateStatusModalSpotify,
} from "../../../../redux/Slice/SpotifySlice";
interface SpotifyItemProps {
  items: Spotify;
}
const SpotifyItem: FC<SpotifyItemProps> = ({ items }) => {
  const dispatch: AppDispatch = useDispatch();
  const imageSRC =
    (items.music.images.length > 1 &&
      items.music.images[items.music.images.length - 1].url) ||
    "";
  const handlePlayMusic = (uri: string) => {
    console.log(uri);
    dispatch(updateLinkSpotify(uri));
    dispatch(updateStatusModalSpotify(true));
  };
  return (
    <section className="wapper-spotify">
      <div className="flex items-center justify-between">
        <figure className="flex gap-3 items-center  cursor-pointer">
          <img
            onClick={() => handlePlayMusic(items.music.uri)}
            src={imageSRC}
            alt="Lỗi Avata "
            width={64}
            height={64}
            className="rounded-md"
          />
          <div>
            <h2
              data-type={items.music.type}
              data-uri={items.music.uri}
              className="text-base capitalize line-clamp-1 text-primary-hover"
            >
              <span onClick={() => handlePlayMusic(items.music.uri)}>
                {items.music.name}
              </span>
            </h2>
            <p className="opacity-80 text-xs capitalize flex gap-2 text-primary-hover hover:opacity-60">
              {items.artists.map((item, index) => (
                <span
                  onClick={() => handlePlayMusic(item.uri)}
                  className="line-clamp-1"
                  key={item.id}
                  data-type={item.type}
                  data-uri={item.uri}
                >
                  {items.artists.length - 1 != index
                    ? item.name + ", "
                    : item.name}
                </span>
              ))}
            </p>
          </div>
        </figure>
        <button
          onClick={() => handlePlayMusic(items.music.uri)}
          className="hidden text-lg  btn_openspotify"
        >
          <BsFillPlayCircleFill />
        </button>
      </div>
    </section>
  );
};

export default SpotifyItem;

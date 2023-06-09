import { FC } from "react";
import { IArtists, IMusic } from "./spotify.contant";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux";
import {
  updateLinkSpotify,
  updateStatusModalSpotify,
} from "../../../../redux/Slice/SpotifySlice";
interface SpotifyItemProps {
  items: IMusic;
  artists: IArtists[];
}
const SpotifyItem: FC<SpotifyItemProps> = ({ items, artists }) => {
  const dispatch: AppDispatch = useDispatch();
  const handlePlayMusic = (key: string, type: string) => {
    dispatch(updateLinkSpotify({ key, type }));
    dispatch(updateStatusModalSpotify(true));
  };

  return (
    <section key={items.encodeId} className="wapper-spotify mt-2">
      <div className="flex items-center justify-between">
        <figure className="flex gap-3 items-center  cursor-pointer">
          <img
            onClick={() => handlePlayMusic(items.encodeId, "song")}
            src={items.thumbnail || "/images/musicavata.png"}
            alt="Lỗi Avata "
            width={64}
            height={64}
            className="rounded-md"
          />
          <div className="max-w-[98%] ">
            <h2
              data-type={items.type}
              className="text-base capitalize line-clamp-1  text-primary-hover"
            >
              <span onClick={() => handlePlayMusic(items.encodeId, "song")}>
                {items.title}
              </span>
            </h2>
            <p className="opacity-80 text-xs capitalize flex gap-2 text-primary-hover hover:opacity-60">
              {artists.map((item, index) => (
                <span
                  onClick={() => handlePlayMusic(item.id, "artist")}
                  className="line-clamp-1"
                  key={item.id}
                  data-type={"artist"}
                  data-uri={item.id}
                >
                  {artists.length - 1 != index ? item.name + ", " : item.name}
                </span>
              ))}
            </p>
          </div>
        </figure>
      </div>
    </section>
  );
};

export default SpotifyItem;

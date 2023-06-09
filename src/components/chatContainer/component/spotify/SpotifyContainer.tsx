import { FC } from "react";
import { Spotify } from "./spotify.contant";
import SpotifyItem from "./SpotifyItem";
import "./spotify.scss";
interface SpotifyContainerProps {
  listSportify: Spotify;
}
const SpotifyContainer: FC<SpotifyContainerProps> = ({ listSportify }) => {
  return (
    <section>
      {listSportify.song && listSportify.song.length > 0 ? (
        listSportify.song.map((item) => (
          <SpotifyItem
            artists={item.artists || []}
            items={item.music || []}
            key={item.music.encodeId}
          />
        ))
      ) : (
        <p>Xin lỗi hệ thống không tìm thấy!</p>
      )}
    </section>
  );
};

export default SpotifyContainer;

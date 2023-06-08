import { FC } from "react";
import { Spotify } from "./spotify.contant";
import { nanoid } from "@reduxjs/toolkit";
import SpotifyItem from "./SpotifyItem";
import "./spotify.scss";
interface SpotifyContainerProps {
  listSportify: Spotify[];
}
const SpotifyContainer: FC<SpotifyContainerProps> = ({ listSportify }) => {
  return (
    <section>
      {listSportify.length > 0 &&
        listSportify.map((item) => <SpotifyItem items={item} key={nanoid()} />)}
    </section>
  );
};

export default SpotifyContainer;

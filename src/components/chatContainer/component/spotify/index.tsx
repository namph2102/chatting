// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SpotifyPlayer from "react-spotify-player";
import { useSelector } from "react-redux";

import { RootState } from "../../../../redux";
import { BiXCircle } from "react-icons/bi";

const SpotifyModal = () => {
  const { isLink } = useSelector((state: RootState) => state.spotifyStore);
  const view = "list"; // or 'coverart'
  const theme = "black"; // or 'white'
  const size = {
    width: "100%",
    height: 500,
  };
  return (
    <article className="lg:min-w[860px] relative md:min-w-[700px] sm:min-w[500px] w-full ">
      <button className=" absolute -top-3 -right-3 text-3xl hover:text-red-600">
        <BiXCircle />
      </button>
      <SpotifyPlayer uri={isLink} size={size} view={view} theme={theme} />
    </article>
  );
};

export default SpotifyModal;

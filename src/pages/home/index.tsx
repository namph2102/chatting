import Header from "../../features/header";
import LayoutSidebar from "../../features/sidebar/layoutSidebar";
import ChattingContainer from "../../components/chatContainer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux";
import VideoSidebar from "../../features/videocall";

import SpotifyModal from "../../components/chatContainer/component/spotify";
import { updateStatusModalSpotify } from "../../redux/Slice/SpotifySlice";
import ModalProviderOverlay from "../../components/Ui/ModalProviderOverlay";
const Home = () => {
  const { userStore, spotifyStore } = useSelector((state: RootState) => state);
  const dispacth: AppDispatch = useDispatch();
  return (
    <>
      <div className="container mx-auto">
        <main className="flex w-full min-h-screen">
          <Header />
          <LayoutSidebar />
          {userStore.isOpencallVideo && <VideoSidebar />}
          <ChattingContainer />
          {spotifyStore.isOpenSoptify && (
            <ModalProviderOverlay
              setIsCloseModal={() => {
                dispacth(updateStatusModalSpotify(false));
              }}
            >
              <SpotifyModal />
            </ModalProviderOverlay>
          )}
        </main>
      </div>
    </>
  );
};

export default Home;

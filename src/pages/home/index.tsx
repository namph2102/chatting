import Header from "../../features/header";
import LayoutSidebar from "../../features/sidebar/layoutSidebar";
import ChattingContainer from "../../components/chatContainer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux";
import VideoSidebar from "../../features/videocall";
import CallbackSoptify from "../callbackSpotify";
import { ModelProvider } from "../../components/Ui";
import SpotifyModal from "../../components/chatContainer/component/spotify";
import { updateStatusModalSpotify } from "../../redux/Slice/SpotifySlice";
const Home = () => {
  const { userStore, spotifyStore } = useSelector((state: RootState) => state);
  const dispacth: AppDispatch = useDispatch();
  return (
    <>
      <div className="container mx-auto">
        <CallbackSoptify />

        <main className="flex w-full min-h-screen">
          <Header />
          <LayoutSidebar />
          {userStore.isOpencallVideo && <VideoSidebar />}
          <ChattingContainer />
          {spotifyStore.isOpenSoptify && (
            <ModelProvider
              setIsCloseModal={() => {
                dispacth(updateStatusModalSpotify(false));
              }}
            >
              <SpotifyModal />
            </ModelProvider>
          )}
        </main>
      </div>
    </>
  );
};

export default Home;

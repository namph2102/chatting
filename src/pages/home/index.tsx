import Header from "../../features/header";
import LayoutSidebar from "../../features/sidebar/layoutSidebar";
import ChattingContainer from "../../components/chatContainer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux";
import VideoSidebar from "../../features/videocall";

import SpotifyModal from "../../components/chatContainer/component/spotify";
import { updateStatusModalSpotify } from "../../redux/Slice/SpotifySlice";
import ModalProviderOverlay from "../../components/Ui/ModalProviderOverlay";
import { useEffect } from "react";
import ChatPerSonContainer from "../../components/ChatPerSonContainer";
const Home = () => {
  const { userStore, spotifyStore, personStore } = useSelector(
    (state: RootState) => state
  );
  const dispacth: AppDispatch = useDispatch();
  useEffect(() => {
    document.title = "Zecky - Ứng dụng nhắn tin";
  }, []);

  return (
    <>
      <div className="container mx-auto relative">
        <main className="flex w-full min-h-screen">
          <Header />
          <LayoutSidebar />
          {userStore.settingVideoCall.isOpen &&
            personStore.person.typechat != "friend" && <VideoSidebar />}
          {personStore.person._id == "chatbot" ? (
            <ChattingContainer />
          ) : (
            <ChatPerSonContainer person={personStore.person} />
          )}

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

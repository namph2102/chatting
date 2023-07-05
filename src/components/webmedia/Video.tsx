import { createContext, useReducer, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { BsArrowsAngleContract, BsArrowsMove } from "react-icons/bs";

import VideoItem from "./component/VideoItem";

import {
  IactionSetting,
  openFullscreen,
  settingVideo,
} from "./context/VideoContext.constant";
import VideoController from "./component/VideoController";
import { cn } from "../../servies/utils";
import { handleChangeSetting } from "./context/VideoContext.handle";
import VideoSidebarProvider from "./UI/VideoSidebarProvider";
import ToltipProvider from "./component/ToltipProvider";

import { socket } from "../ChatPerSonContainer/ChatPerSonContainer";

export const VideoContext = createContext(settingVideo);

const settingReducer = (state: typeof settingVideo, action: IactionSetting) => {
  const { type } = action.payload;
  if (Object.keys(state).includes(type)) {
    switch (type) {
      case "isZoom":
        openFullscreen(".open__fullscreen", !state[type]);
        break;
    }

    state[type] = !state[type];
  }

  return { ...state };
};
const Video = () => {
  const { theme, account, idPeerJs, settingVideoCall } =
    useSelector((state: RootState) => state.userStore) || {};
  const person = useSelector((state: RootState) => state.personStore.person);
  const [setting, dispatchContext] = useReducer(settingReducer, settingVideo);

  const handleCloseVideoCall = () => {
    socket.emit("user-leave-room-call-now", {
      idPeerJs: idPeerJs,
      idAccount: account._id,
      idPerson: person._id,
      roomId: settingVideoCall.roomId,
    });
    dispatchContext(handleChangeSetting("isMic"));
    dispatchContext(handleChangeSetting("isCamera"));
  };
  const timeRef = useRef<HTMLSpanElement>(null);

  return (
    <VideoContext.Provider value={settingVideo}>
      <div
        id={theme.darkmode}
        className={cn(
          "fixed z-[100] open__fullscreen inset-0 bg-black/95 ease-linear duration-200  ",
          setting.isLeave ? "scale-0" : "scale-100"
        )}
      >
        <div className="h-[calc(100%-80px)]  flex gap-4 ">
          <VideoItem setting={setting} />
          <VideoSidebarProvider
            handleClose={() =>
              dispatchContext(handleChangeSetting("isChatting"))
            }
            isChatting={setting.isChatting}
          />
        </div>

        <section className="video__setting text-2xl lg-px-12 sm:px-8 flex sm:justify-between justify-center items-center bg-black h-20 absolute left-0 bottom-0 right-0">
          <h2 className="hidden flex-2 text-base sm:flex ">
            <span ref={timeRef} className="block border-r-2 border-white pr-2">
              00:00
            </span>
            <span className="block  pl-2 capitalize">{account.fullname}</span>
          </h2>
          <VideoController
            setting={setting}
            dispatchContext={dispatchContext}
            handleCloseVideoCall={handleCloseVideoCall}
          />
          <div className="sm:flex gap-2  hidden">
            <ToltipProvider title={!setting.isZoom ? "Phóng to" : "Thu nhỏ"}>
              <button
                onClick={() => dispatchContext(handleChangeSetting("isZoom"))}
                className="p-2"
              >
                {!setting.isZoom ? <BsArrowsMove /> : <BsArrowsAngleContract />}
              </button>
            </ToltipProvider>
          </div>
        </section>
      </div>
    </VideoContext.Provider>
  );
};

export default Video;

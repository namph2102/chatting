import { createContext, useReducer } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import {
  BsArrowsAngleContract,
  BsArrowsMove,
  BsFillPeopleFill,
} from "react-icons/bs";

import { Badge } from "@mui/material";
import ToltipProvider from "./component/ToltipProvider";
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
  const { theme } = useSelector((state: RootState) => state.userStore) || {};
  const [setting, dispatchContext] = useReducer(settingReducer, settingVideo);

  return (
    <VideoContext.Provider value={settingVideo}>
      <div
        id={theme.darkmode}
        className={cn(
          "fixed z-[100] open__fullscreen inset-0 bg-black/95 ease-linear duration-200",
          setting.isLeave ? "scale-0" : "scale-100"
        )}
      >
        <div className="h-[calc(100%-80px)]  flex gap-4 ">
          {/* Gọi nhóm nhiều người */}
          {/* 
            <div className="h-[calc(100%-80px)] grid grid-cols-1 grid-rows-3 gap-4 ">
          <div className="w-screen">
            <VideoHeader />
          </div>
          <div className="grid grid-cols-2 gap-4 row-span-2 mt-8">
            <VideoItem />
  
            <VideoItem />
          </div> 
            </div>
          */}
          {/*end Gọi nhóm nhiều người */}

          <VideoItem setting={setting} dispatchContext={dispatchContext} />
          <VideoSidebarProvider
            handleClose={() =>
              dispatchContext(handleChangeSetting("isChatting"))
            }
            isChatting={setting.isChatting}
          />
        </div>

        <section className="video__setting text-2xl lg-px-12 sm:px-8 flex sm:justify-between justify-center items-center bg-black h-20 absolute left-0 bottom-0 right-0">
          <h2 className="hidden flex-2 text-base sm:flex ">
            <span className="block border-r-2 border-white pr-2">05:50</span>
            <span className="block  pl-2">Team Metting</span>
          </h2>
          <VideoController
            setting={setting}
            dispatchContext={dispatchContext}
          />
          <div className="sm:flex gap-2  hidden">
            <ToltipProvider title="Hiển thị tắt cả mọi người">
              <Badge badgeContent={1} color="primary">
                <button className="p-2 ">
                  <BsFillPeopleFill />
                </button>
              </Badge>
            </ToltipProvider>
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

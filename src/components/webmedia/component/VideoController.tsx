import {
  BsArrowUpShort,
  BsChatLeftDotsFill,
  BsChatLeftFill,
  BsFillCameraVideoFill,
  BsFillCameraVideoOffFill,
  BsFillLaptopFill,
  BsFillPeopleFill,
  BsFillVolumeMuteFill,
  BsFillVolumeUpFill,
  BsHandIndexThumbFill,
  BsHandThumbsDownFill,
  BsMicFill,
  BsMicMuteFill,
} from "react-icons/bs";
import { RiChatUploadLine, RiPhoneFill } from "react-icons/ri";
import ToltipProvider from "./ToltipProvider";
import { IactionSetting } from "../context/VideoContext.constant";
import { FC, useState } from "react";

import { Badge } from "@mui/material";
import { ModalStatus } from "../../Ui";
import { TSettings } from "../context/VideoContext.constant";
import { Debounced, cn } from "../../../servies/utils";
import { handleChangeSetting } from "../context/VideoContext.handle";

interface VideoControllerRef {
  dispatchContext: React.Dispatch<IactionSetting>;
  setting: TSettings;
}
const VideoController: FC<VideoControllerRef> = ({
  dispatchContext,
  setting,
}) => {
  const [optionCurrent, setOptisonCurrent] = useState<{
    type: keyof TSettings | null;
    title: string;
  }>({ type: null, title: "" });
  const CallBackStatus = (status: boolean) => {
    console.log(status);
    if (status) {
      switch (optionCurrent.type) {
        case "isLeave":
          dispatchContext(handleChangeSetting("isLeave"));
      }
    }

    setOptisonCurrent({ type: null, title: "" });
  };
  const handleChangeOptions = (type: keyof TSettings) => {
    console.log(type);
    let title = "";
    switch (type) {
      case "isLeave":
        title = "đóng cửa sổ";
        break;
    }
    setOptisonCurrent({ type, title });
  };

  return (
    <article className="sm:text-2xl flex sm:gap-4  gap-2 text-lg">
      {optionCurrent.type && (
        <ModalStatus
          callBackStatus={CallBackStatus}
          title={`Bạn xác nhận ${optionCurrent.title}?`}
        />
      )}

      <ToltipProvider title={setting.isMic ? "Tắt Mic" : "Mở Mic"}>
        <button
          onClick={() => dispatchContext(handleChangeSetting("isMic"))}
          className={cn(
            "p-2 bg-follow-darkmode text-primary-hover rounded-full",
            !setting.isMic ? "active" : ""
          )}
        >
          {setting.isMic ? <BsMicFill /> : <BsMicMuteFill />}
        </button>
      </ToltipProvider>
      <ToltipProvider title={setting.isCamera ? "Tắt Camera" : "Mở Camera"}>
        <button
          data-active={setting.isCamera}
          onClick={() => dispatchContext(handleChangeSetting("isCamera"))}
          className={cn(
            "p-2 bg-follow-darkmode text-primary-hover rounded-full",
            !setting.isCamera ? "active" : ""
          )}
        >
          {setting.isCamera ? (
            <BsFillCameraVideoFill />
          ) : (
            <BsFillCameraVideoOffFill />
          )}
        </button>
      </ToltipProvider>
      <ToltipProvider
        title={setting.isVolume ? "Tắt âm thanh" : "Mở  âm thanh"}
      >
        <button
          onClick={() => dispatchContext(handleChangeSetting("isVolume"))}
          data-active={setting.isVolume}
          className={cn(
            "p-2 bg-follow-darkmode text-primary-hover rounded-full",
            !setting.isVolume ? "active" : ""
          )}
        >
          {setting.isVolume ? <BsFillVolumeUpFill /> : <BsFillVolumeMuteFill />}
        </button>
      </ToltipProvider>

      <ToltipProvider
        className="sm:block hidden"
        title={
          setting.isChatting ? "Tắt trò chuyện" : "Trò chuyện với mọi người"
        }
      >
        <button
          onClick={() => dispatchContext(handleChangeSetting("isChatting"))}
          className={cn(
            "p-2 bg-follow-darkmode text-primary-hover rounded-full",
            setting.isChatting ? "option" : ""
          )}
        >
          {!setting.isChatting ? <BsChatLeftDotsFill /> : <BsChatLeftFill />}
        </button>
      </ToltipProvider>

      <ToltipProvider title={setting.isHandle ? "Tắt Giơ tay" : "Giơ tay"}>
        <button
          onClick={() => dispatchContext(handleChangeSetting("isHandle"))}
          className={cn(
            "p-2 bg-follow-darkmode text-primary-hover rounded-full",
            setting.isHandle ? "option" : ""
          )}
        >
          {!setting.isHandle ? (
            <BsHandIndexThumbFill />
          ) : (
            <BsHandThumbsDownFill />
          )}
        </button>
      </ToltipProvider>
      <ToltipProvider
        title={
          !setting.isShareDisplay ? "Chia sẻ màn hình" : "Tắt chia sẻ màn hình"
        }
      >
        <button
          onClick={() => dispatchContext(handleChangeSetting("isShareDisplay"))}
          className={cn(
            "p-2 bg-follow-darkmode  text-primary-hover rounded-full",
            setting.isShareDisplay ? "option" : ""
          )}
        >
          {!setting.isShareDisplay ? (
            <RiChatUploadLine />
          ) : (
            <BsFillLaptopFill />
          )}
        </button>
      </ToltipProvider>
      <ToltipProvider title="Đóng cửa sổ">
        <button
          onClick={Debounced(() => handleChangeOptions("isLeave"), 200)}
          className="p-2 bg-follow-darkmode active text-primary-hover rounded-full rotate-[138deg]"
        >
          <RiPhoneFill />
        </button>
      </ToltipProvider>

      <ToltipProvider className="sm:hidden" title="Hiện all">
        <button
          className={cn(
            "p-2 bg-follow-darkmode text-primary-hover rounded-full",
            setting.isCamera
          )}
        >
          <BsArrowUpShort />
        </button>
        <div className="absolute bottom-16 text-2xl -right-6  min-w-[100px] shadow-lg  bg-black/80 flex flex-col items-center">
          <ul>
            <li>
              <ToltipProvider title="Hiển thị tắt cả mọi người">
                <Badge badgeContent={1} color="primary">
                  <button className="p-2 ">
                    <BsFillPeopleFill />
                  </button>
                </Badge>
              </ToltipProvider>
            </li>
            <li>
              <ToltipProvider
                title={
                  setting.isChatting
                    ? "Tắt trò chuyện"
                    : "Trò chuyện với mọi người"
                }
              >
                <button className="p-2 text-primary-hover rounded-full">
                  {!setting.isChatting ? (
                    <BsChatLeftDotsFill />
                  ) : (
                    <BsChatLeftFill />
                  )}
                </button>
              </ToltipProvider>
            </li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </ToltipProvider>
    </article>
  );
};

export default VideoController;

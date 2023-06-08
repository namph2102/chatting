import { BiX } from "react-icons/bi";
import "./ui.scss";
import { BsSend } from "react-icons/bs";
import { cn } from "../../../servies/utils";
import { FC } from "react";
interface VideoSidebarProviderProps {
  isChatting: boolean;
  handleClose: () => any;
}
const VideoSidebarProvider: FC<VideoSidebarProviderProps> = ({
  isChatting,
  handleClose,
}) => {
  return (
    <aside
      className={cn(
        " ease-linear duration-300  relative",
        isChatting ? "effect_sidebar" : "hide_effect_sidebar"
      )}
    >
      <>
        <div className="flex justify-between px-2">
          <h2 className="text-xl">Tin nhắn trong cuộc gọi</h2>
          <button onClick={() => handleClose()} className="text-3xl ">
            <BiX />
          </button>
        </div>
        <div className="px-4 text-xs py-3  bg-gray-100 mt-4 rounded-sm">
          Chỉ những người trong cuộc gọi mới nhìn thấy tin nhắn và tin nhắn sẽ
          bị xóa khi cuộc gọi kết thúc
        </div>
        <div className="max-h-[calc(100%-160px)] sidebarchat_video overflow-y-auto">
          <div className="text-sm px-4 ">
            <p className="mt-2">
              <span className="font-semibold mr-1">Bạn</span>{" "}
              <span className="text-gray-400">14:39</span>
            </p>
            <p>
              How old are you dsa asdsa dsa dsa ds a dsa d sa dsa d sa dsa dsa{" "}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center absolute bottom-3 left-0 right-0 px-4">
          <textarea
            name=""
            id=""
            placeholder="Gửi tin nhắn"
            className="w-full h-auto border px-2 text-sm rounded-full bg-gray-100 py-2 outline-none"
            rows={2}
          ></textarea>
          <button className="text-2xl font-bold p-2">
            <BsSend />
          </button>
        </div>
      </>
    </aside>
  );
};

export default VideoSidebarProvider;

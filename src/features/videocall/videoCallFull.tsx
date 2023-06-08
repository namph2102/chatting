import { useState } from "react";
import { BiXCircle } from "react-icons/bi";
import Jitsi from "react-jitsi";
import { ToastNotify } from "../../servies/utils";
import "./videocall.scss";
import { LoaddingOverLay } from "../../components/loading";
import { AppDispatch } from "../../redux";
import { useDispatch } from "react-redux";
import { setIsopenCallvideo } from "../../redux/Slice/AccountSlice";
import ToltipProvider from "../../components/webmedia/component/ToltipProvider";

export default function VideoCallFull() {
  const [displayName, setDisplayName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isLoadding, setisLoading] = useState<boolean>(false);
  const dispatchRedux: AppDispatch = useDispatch();
  const handleOpenvideoCall = () => {
    dispatchRedux(setIsopenCallvideo(false));
  };
  const [onCall, setOnCall] = useState(false);
  const handleAPILoad = () => {
    setisLoading(false);
    const idIfame: HTMLIFrameElement | null =
      document.querySelector("#react-jitsi-frame");
    if (idIfame) {
      idIfame.style.display = "block";

      const logo = document.querySelector(".toolbox-content-items");
      console.log(logo);
    }
    // You can perform additional actions with the Jitsi Meet API here
  };
  const handleCreateRandom = () => {
    setRoomName(Math.random().toString(36).substring(2, 8).replace(/\s/g, ""));
    ToastNotify("Tạo phòng thành công").success();
  };

  return onCall ? (
    <>
      {isLoadding && <LoaddingOverLay />}

      <section className="absolute video_container">
        <div className="absolute w-40 h-10 bg-transparent top-8 left-2"></div>
        <button
          onClick={handleOpenvideoCall}
          className="text-4xl effect_close-btn  absolute hover:text-red-500 top-1 left-2  "
        >
          {" "}
          <ToltipProvider title="Rời khỏi phòng" className="block rotate-360">
            <span title="Rời khỏi phòng">
              {" "}
              <BiXCircle />
            </span>
          </ToltipProvider>
        </button>

        <Jitsi
          roomName={roomName}
          displayName={displayName}
          onIframeLoad={() => setisLoading(true)}
          domain="8x8.vc"
          config={{ startAudioOnly: true }}
          interfaceConfig={{ filmStripOnly: true }}
          onAPILoad={handleAPILoad}
          containerStyle={{
            width: window.innerWidth + "px",
            height: window.innerHeight + "px",
          }}
        />
      </section>
    </>
  ) : (
    <div className="bg-[#111] relative create_room flex flex-col gap-3  px-6 min-h-[60vh] justify-center  rounded-lg sm:min-w-[500px] min-w-[300px] max-w-[400px]  py-4 ">
      <h1 className="text-2xl my-4 text-center">Zecky đồng hành cùng bạn !</h1>
      <button
        onClick={handleOpenvideoCall}
        className="text-4xl absolute hover:text-red-500  top-2 right-2 "
      >
        <BiXCircle />
      </button>
      <input
        type="text"
        placeholder="Tham gia phòng hoặc tạo phòng"
        value={roomName}
        className="py-3 px-2 text-black rounded-xl sm:text-base text-lg  form-group "
        onChange={(e) => setRoomName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tên hiển thị"
        className="py-3 px-2 text-black rounded-xl sm:text-base text-lg  form-group "
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <div className="flex justify-end  flex-1">
        <button
          onClick={handleCreateRandom}
          className="py-1 px-3 hover:bg-gray-500 text-xs rounded-full  bg-gray-400 text-black"
        >
          Tạo phòng ngẫu nhiên
        </button>
      </div>
      <p className="text-[12px]">
        Lưu ý: Nội dung cuộc cuộc gọi và tin nhắn sẽ bị xóa sau khi cuộc gọi kết
        thúc !
      </p>
      <button
        className="bg-green-800 rounded-full py-2 sm:py-3  hover:bg-green-600"
        onClick={() => {
          setisLoading(true);
          setOnCall(true);
        }}
      >
        Tham gia ngay
      </button>
    </div>
  );
}

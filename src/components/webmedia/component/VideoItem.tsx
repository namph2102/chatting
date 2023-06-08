import { FC, useEffect, useState } from "react";

import { IactionSetting, TSettings } from "../context/VideoContext.constant";
// import { io } from "socket.io-client";
// const socket = io("http://localhost:3000/", { transports: ["websocket"] });
// socket.on("connect", () => {
//   console.log("id socket: ", socket.id); // x8WIv7-mJelg7on_ALbx
// });
import {
  getDisplayMediaStream,
  getUserMediaStream,
  playStream,
  stopAudioOnly,
  stopBothVideoAndAudio,
} from "../videoUtil";
import { BsLightbulbFill, BsMicMuteFill } from "react-icons/bs";
import { ToastNotify, cn } from "../../../servies/utils";
import { handleChangeSetting } from "../context/VideoContext.handle";
import { Peer } from "peerjs";

const peer = new Peer();

peer.on("connection", function (conn) {
  // Receive messages
  conn.on("data", function (data) {
    console.log("Tao nhận message", data);
  });

  // Send messages
  conn.send("Hello!");
});
let idPeerjs = "";
peer.on("open", function (id) {
  console.log(id);
  idPeerjs = id;
});
interface VideoItemProps {
  setting: TSettings;
  dispatchContext: React.Dispatch<IactionSetting>;
}
const VideoItem: FC<VideoItemProps> = ({ setting, dispatchContext }) => {
  const [idUser, setIDUser] = useState<string>(idPeerjs);
  useEffect(() => {
    if (!idUser) return;

    const conn = peer.connect(idUser);
    conn.on("open", () => {
      conn.send("Hello from PeerJS!");
    });
  }, [idUser]);
  useEffect(() => {
    if (navigator.mediaDevices && idUser) {
      if (setting.isShareDisplay) {
        getDisplayMediaStream(setting.isMic, true).then((stream) => {
          // Kiểm tra khi người dùng dừng chia sẻ màn hình
          const track = stream.getVideoTracks()[0];
          const call = peer.call(idUser, stream);
          call.on(
            "stream",
            function (remoteStream) {
              if (setting.isLeave) {
                stopBothVideoAndAudio(remoteStream);
                playStream("#videoRef", null);
              } else playStream("#videoRef", remoteStream);
              if (!setting.isMic) {
                stopAudioOnly(remoteStream);
              }
            },
            function (err: any) {
              console.log("Failed to get local stream", err);
            }
          );

          track.onended = function () {
            ToastNotify("Bạn đã ngừng chia sẻ màn hình").success();
            dispatchContext(handleChangeSetting("isShareDisplay"));
            stopBothVideoAndAudio(stream);
            return;
          };
        });
      } else {
        getUserMediaStream(true, setting.isCamera).then((stream) => {
          const call = peer.call(idUser, stream);
          call.on(
            "stream",
            function (remoteStream) {
              if (setting.isLeave) {
                stopBothVideoAndAudio(remoteStream);
                playStream("#videoRef", null);
              } else playStream("#videoRef", remoteStream);
              if (!setting.isMic) {
                stopAudioOnly(remoteStream);
              }
            },
            function (err: any) {
              console.log("Failed to get local stream", err);
            }
          );
        });
        peer.on("call", function (call) {
          getUserMediaStream(true, setting.isCamera).then((stream) => {
            call.answer(stream);
            call.on(
              "stream",
              function (remoteStream) {
                if (setting.isLeave) {
                  stopBothVideoAndAudio(remoteStream);
                  playStream("#videoRef", null);
                } else playStream("#videoRef", remoteStream);
                if (!setting.isMic) {
                  stopAudioOnly(remoteStream);
                }
              },
              function (err: any) {
                console.log("Failed to get local stream", err);
              }
            );
          });
        });
      }
    }
    return () => {
      playStream("#videoRef", null);
    };
  }, [
    setting.isCamera,
    setting.isMic,
    setting.isLeave,
    setting.isShareDisplay,
    idUser,
    dispatchContext,
  ]);
  const handleSubmitID = () => {
    const result = prompt("Nhập id người bạn để gọi");
    if (!result) return;
    setIDUser(result);
  };
  return (
    <section className="p-4 flex relative w-full  justify-center items-center border-[3px] border-blue-700 rounded-2xl">
      <figure className="p-8 rounded-full  bg-black/20 ">
        <img
          src="/images/avata.jpg"
          className="w-24 h-24 object-cover rounded-full"
          alt=""
        />
      </figure>
      {/* //test */}
      <div className="idtext absolute top-4 left-0">
        <input
          type="text"
          className="text-black min-w-[300px]"
          defaultValue={idUser}
        />
        <div className="h-4"></div>
        <div>
          <button
            onClick={handleSubmitID}
            className="py-2 mt-2 px-2 bg-gray-700 rounded-xl"
          >
            Nhập id
          </button>
        </div>
      </div>
      <video
        autoPlay
        muted={!setting.isVolume}
        id="videoRef"
        className="absolute h-full left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 inset-0"
      ></video>

      <div
        className={cn(
          "fixed ease-in duration-300 top-8  text-yellow-600 w-8 h-8 bg-gray-500 rounded-full flex justify-center items-center",
          !setting.isHandle ? "-left-10" : "left-8"
        )}
      >
        <BsLightbulbFill />
      </div>
      {setting.isMic ? (
        <div className="sound_container rounded-full ">
          <p className="sound_container-effect"></p>
          <p className="sound_container-effect"></p>
          <p className="sound_container-effect"></p>
        </div>
      ) : (
        <BsMicMuteFill className="absolute top-4 right-4 text-2xl" />
      )}
    </section>
  );
};

export default VideoItem;

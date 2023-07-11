import { FC, useEffect, useState } from "react";

import { TSettings } from "../context/VideoContext.constant";

import {
  cleanupMediaDevices,
  getUserMediaStream,
  playStream,
  stopAudioOnly,
  stopBothVideoAndAudio,
} from "../videoUtil";
import { BsLightbulbFill, BsMicMuteFill } from "react-icons/bs";
import { cn } from "../../../servies/utils";

import { Peer } from "peerjs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux";
import { updatePeerjs } from "../../../redux/Slice/AccountSlice";

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
  console.log("idPeerjs", idPeerjs);
  idPeerjs = id;
});
interface VideoItemProps {
  setting: TSettings;
}
const VideoItem: FC<VideoItemProps> = ({ setting }) => {
  const idPeerJsPerson = useSelector(
    (state: RootState) => state.userStore.idPeerJs
  );
  const [idUser] = useState<string>(idPeerJsPerson || idPeerjs);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (!idUser) return;

    const conn = peer.connect(idUser);
    dispatch(updatePeerjs(idUser));
    conn.on("open", () => {
      conn.send("Hello from PeerJS!");
    });
  }, [idUser, idPeerJsPerson]);

  useEffect(() => {
    let videoStream: MediaStream;
    let videoPersonStream: MediaStream;
    if (navigator.mediaDevices && idUser) {
      getUserMediaStream(true, setting.isCamera).then((stream) => {
        const call = peer.call(idUser, stream);
        playStream("#accountRef", stream);
        videoStream = stream;
        call.on(
          "stream",
          function (remoteStream) {
            videoPersonStream = remoteStream;
            if (setting.isLeave) {
              stopBothVideoAndAudio(remoteStream);
              playStream("#videoRef", null);
              cleanupMediaDevices(remoteStream);
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
          videoStream = stream;

          playStream("#accountRef", stream);
          call.answer(stream);
          call.on(
            "stream",
            function (remoteStream) {
              videoPersonStream = remoteStream;
              if (setting.isLeave) {
                stopBothVideoAndAudio(remoteStream);
                playStream("#videoRef", null);
                cleanupMediaDevices(remoteStream);
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
    return () => {
      try {
        playStream("#videoRef", null);
        playStream("#accountRef", null);
        if (videoStream) {
          stopBothVideoAndAudio(videoStream);
        }
        if (videoPersonStream) {
          stopBothVideoAndAudio(videoPersonStream);
        }
        cleanupMediaDevices(videoStream);
        cleanupMediaDevices(videoPersonStream);
      } catch (err) {
        console.log(err);
      }
    };
  }, [
    setting.isCamera,
    setting.isMic,
    setting.isLeave,
    idUser,
    idPeerJsPerson,
  ]);

  return (
    <section className="p-4 flex relative w-full  justify-center items-center border-[3px] border-blue-700 rounded-2xl">
      <figure className="p-8 rounded-full  bg-black/20 ">
        <img
          src="/images/avata.jpg"
          className="w-24 h-24 object-cover rounded-full"
          alt=""
        />
      </figure>

      <video
        id="accountRef"
        className="w-28 h-44 md:w-60 md:h-44 absolute top-2 right-2 z-10"
        autoPlay
      ></video>
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

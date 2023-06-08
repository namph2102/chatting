/* eslint-disable @typescript-eslint/no-unused-vars */
// stop both mic and camera
export function stopBothVideoAndAudio(stream: MediaStream) {
  stream.getTracks().forEach((track) => {
    if (track.readyState == "live") {
      track.stop();
    }
  });
}

// stop only camera
export function stopVideoOnly(stream: MediaStream) {
  stream.getTracks().forEach((track) => {
    if (track.readyState == "live" && track.kind === "video") {
      track.stop();
    }
  });
}

// stop only mic
export function stopAudioOnly(stream: MediaStream) {
  stream.getTracks().forEach((track) => {
    if (track.readyState == "live" && track.kind === "audio") {
      track.stop();
    }
  });
}

import { Peer } from "peerjs";
export const peer = new Peer();
peer.on("connection", function (conn) {
  // Receive messages
  conn.on("data", function (data) {
    console.log("Received", data);
  });

  // Send messages
  conn.send("Hello!");
});

export const getUserMediaStream = (_audio: boolean, video: boolean) => {
  const config = { audio: true, video };
  return navigator.mediaDevices.getUserMedia(config);
};
export const getDisplayMediaStream = (_audio: boolean, video = true) => {
  const config = { audio: false, video: video };
  return navigator.mediaDevices.getDisplayMedia(config);
};
export const playStream = (id: string, stream: MediaStream | null) => {
  const element: HTMLVideoElement | null = document.querySelector(id);
  if (!element) return;
  // element.classList.toggle("hidden");

  element.srcObject = stream;
};

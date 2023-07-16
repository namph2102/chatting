import { FC, useEffect, useState } from "react";
import { BiMicrophone, BiRevision, BiSend, BiTrash } from "react-icons/bi";
import AudioComment from "./AudioComment";
import { ToastNotify, cn } from "../../../servies/utils";
import { Tooltip } from "@mui/material";
import { componentsProps } from "../../../styles/componentsProps";
import { convertToBase64 } from "../util";
import { useTranslation } from "react-i18next";
import "../../../servies/translate/contfigTranslate";
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: BlobPart[] | any[] = [];

interface RecorderComponentProps {
  handleSendMessage: (audioBlog: Blob | any, type: string) => void;
  setIsOpenSpeakVoice: (isOpen: boolean) => void;
}
const RecorderComponent: FC<RecorderComponentProps> = ({
  handleSendMessage,
  setIsOpenSpeakVoice,
}) => {
  const { t } = useTranslation();
  const [audioBlob, setAudioBlob] = useState<Blob>();
  const [audioURL, setAudioURL] = useState("");

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlogMp3 = new Blob(audioChunks, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlogMp3);
        setAudioBlob(audioBlogMp3);
        setAudioURL(audioUrl);
        audioChunks = [];
      });

      mediaRecorder.start();
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
  };
  const [isClickButton, setIsClickButton] = useState(false);

  const handleClickme = (isClickButton: boolean) => {
    if (isClickButton) {
      handleDeleteSoundOld();
      startRecording();
    } else {
      stopRecording();
    }
    setIsClickButton(isClickButton);
  };
  const handleDeleteSoundOld = () => {
    if (audioURL) {
      audioURL && URL.revokeObjectURL(audioURL);
      setAudioURL("");
      stopRecording();
    }
  };
  useEffect(() => {
    return () => {
      handleDeleteSoundOld();
    };
  }, []);
  const handleGetBase64 = (base64: string) => {
    if (base64.includes("data:audio/webm;base64,")) {
      const newBase64 = base64.replace("data:audio/webm;base64,", "");
      const byteCharacters = atob(newBase64);
      const byteLength = byteCharacters.length;
      const kilobytes = byteLength / 1024;
      console.log(kilobytes);
      if (kilobytes > 2100) {
        ToastNotify(t("recordMessage")).error();
        handleDeleteSoundOld();
      } else {
        handleSendMessage(base64, "audio");
        setIsOpenSpeakVoice(false);
      }
    }
  };
  const handleSendAudio = () => {
    if (audioBlob) {
      convertToBase64(audioBlob, handleGetBase64);
      handleDeleteSoundOld();
    }
  };
  return (
    <>
      <div
        className={cn(
          "flex justify-center flex-col items-center",
          audioURL ? "hidden" : ""
        )}
      >
        <button
          onClick={() => handleClickme(!isClickButton)}
          className={cn(
            "border rounded-full p-2 cursor-pointer text-3xl",
            isClickButton ? "background-primary" : ""
          )}
        >
          <BiMicrophone />
        </button>
        <p className="mx-2 text-sm">
          {!isClickButton ? t("keypressToSpeak") : t("keyDownToSpeak")}
        </p>
      </div>

      {audioURL && (
        <div className=" w-full px-4">
          <div className="flex justify-center h-[30px]">
            <AudioComment link={audioURL} />
          </div>
          <div className="flex text-3xl justify-between">
            <div className="flex gap-1">
              <Tooltip
                onClick={handleDeleteSoundOld}
                title={t("delete")}
                arrow
                componentsProps={componentsProps}
              >
                <span className="text-red-500 cursor-pointer">
                  <BiTrash />
                </span>
              </Tooltip>
              <Tooltip
                onClick={() => {
                  handleDeleteSoundOld(), handleClickme(false);
                }}
                title={t("record")}
                arrow
                componentsProps={componentsProps}
              >
                <span className="cursor-pointer">
                  <BiRevision />
                </span>
              </Tooltip>
            </div>

            <button
              onClick={handleSendAudio}
              className="flex items-center justify-center gap-1 background-primary background-primary-hover   py-1 px-3 rounded-xl"
            >
              <span className="text-base"> {t("send")} </span>
              <span className="text-base">
                <BiSend />
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RecorderComponent;

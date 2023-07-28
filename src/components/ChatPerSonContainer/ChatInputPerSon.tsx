import { FC, useRef, useState, useCallback, useEffect } from "react";

import {
  BiDotsHorizontalRounded,
  BiGridAlt,
  BiImages,
  BiLoaderCircle,
  BiMicrophone,
  BiMicrophoneOff,
  BiSend,
  BiSmile,
  BiX,
} from "react-icons/bi";
import { TextareaAutosize } from "@mui/base";
import { Tooltip } from "@mui/material";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { LoaddingOverLay, LoadingDot } from "../loading";
import { HandleCoverSpeaktoText } from "../webmedia";
import {
  Debounced,
  ToastNotify,
  cn,
  deFaultIconSize,
} from "../../servies/utils";
import { componentsProps } from "../../styles/componentsProps";
import MyDropzone from "./component/MyDropzone";
import ModalProviderOverlay from "../Ui/ModalProviderOverlay";
import RecorderComponent from "./component/RecorderComponent";
import { domainserver } from "../../config";
import { useTranslation } from "react-i18next";
import "../../servies/translate/contfigTranslate";

interface ChatInputPerSonProps {
  loading: boolean;
  className: string;
  handleSendMessage: (
    inputElement: HTMLTextAreaElement | any,
    type: string
  ) => void;
  setIsOpenGhim: (isOpenGhim: any) => any;
}

const ChatInputPerSon: FC<ChatInputPerSonProps> = ({
  loading,
  className,
  handleSendMessage,
  setIsOpenGhim,
}) => {
  const { t } = useTranslation();

  const [isOpenEmoji, setIsOpenEmoji] = useState<boolean>(false);
  const [isOpenEVoices, setIsOpenVoices] = useState<boolean>(false);
  const btnMoreRef = useRef<HTMLDivElement>(null);
  const btnMoreOpenRef = useRef<HTMLDivElement>(null);
  const chattingRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const handleTurnOffEmoji = () => {
      setIsOpenEmoji(false);
    };

    document.addEventListener("click", handleTurnOffEmoji);
    const handleChattingEnter = (e: KeyboardEvent) => {
      if (!chattingRef.current?.value) return;
      if (e.key === "Enter") {
        if (loading) {
          return;
        }
        handleSubmitMessage();
      }
    };
    document.addEventListener("keypress", handleChattingEnter);
    return () => {
      document.removeEventListener("keypress", handleChattingEnter);
      document.removeEventListener("click", handleTurnOffEmoji);
    };
  }, []);
  const handdleSelect = (emo: { native: string }) => {
    setIsOpenEmoji(false);
    if (chattingRef.current) {
      chattingRef.current.value += emo.native;
    }
  };

  const callbackText = useCallback((str: string | boolean | any) => {
    setIsOpenVoices(false);
    if (str && chattingRef.current) {
      chattingRef.current.value = str;
      chattingRef.current.focus();
    }
  }, []);

  const handleCallVoices = () => {
    if (chattingRef.current) {
      chattingRef.current.value = "";
    }
    if (!isOpenEVoices) {
      setIsOpenVoices(true);
      HandleCoverSpeaktoText(callbackText);
    }
  };

  const handleForcusChatting = (isForcus: boolean) => {
    if (window.innerWidth < 640) {
      setIsOpenEmoji(false);
      if (isForcus) {
        btnMoreRef.current?.classList.add("hidden__effect");
        btnMoreOpenRef.current?.classList.remove("hidden");
      } else {
        btnMoreRef.current?.classList.remove("hidden__effect");
        btnMoreOpenRef.current?.classList.add("hidden");
      }
    }
  };
  const handleSubmitMessage = () => {
    if (!chattingRef.current) return;
    handleSendMessage(chattingRef.current, "text");
    chattingRef.current.value = "";
    chattingRef.current.blur();
  };
  const [isOpenModuleFile, setIsOpenFile] = useState<boolean>(false);
  const [isOpenMoreChat, setIsOpenMoreChat] = useState<boolean>(false);
  useEffect(() => {
    document.addEventListener("click", () => {
      setIsOpenMoreChat(false);
    });
    return () => {
      document.removeEventListener("click", () => {
        setIsOpenMoreChat(false);
      });
    };
  }, []);
  const [isOpenSpeakVoice, setIsOpenSpeakVoice] = useState(false);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position: any) => {
        const { latitude, longitude } = position.coords;
        handleSendMessage(
          JSON.stringify({ lat: latitude, log: longitude }),
          "location"
        );
      });
    } else {
      ToastNotify(`${t("send")} ${t("location")} ${t("error")} `).error();
    }
  };
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSubmitDocument = (e: HTMLInputElement | any) => {
    const selectedFile = e.target.files[0];
    setIsLoading(true);
    if (selectedFile) {
      const formdata = new FormData();
      formdata.append("file", selectedFile);
      fetch(domainserver + "upload", {
        method: "POST",
        body: formdata,
      })
        .then((res) => res.json())
        .then((data: any) => {
          if (data.status == 201) {
            if (data?.fileInform?.fileName) {
              handleSendMessage(data.fileInform, "document");
            }
          }
          // File uploaded successfully
        })
        .catch((error: any) => {
          console.log(error.message);
          ToastNotify(`${t("send")} File ${t("error")}}!`).error();
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    e.target.value = null;
  };
  return (
    <>
      {isLoading && <LoaddingOverLay />}
      {isOpenModuleFile && (
        <ModalProviderOverlay
          setIsCloseModal={() => setIsOpenFile(!isOpenModuleFile)}
        >
          <div className="relative">
            <MyDropzone
              setIsOpenFile={setIsOpenFile}
              handleSendMessage={handleSendMessage}
            />
          </div>
        </ModalProviderOverlay>
      )}
      <section
        className={cn(
          " bg-follow-darkmode absolute sm:bottom-3 bottom-0 left-0 w-full  sm:p-4 py-4 px-3",

          className
        )}
      >
        <input id="uploadfile" type="file" hidden />
        <div className="flex justify-between w-full overflow-x-hidden  sm:gap-4 gap-2 items-center h-full">
          <div
            ref={btnMoreOpenRef}
            title={t("openMore")}
            onTouchStart={() => {
              handleForcusChatting(false),
                window.innerWidth < 640 &&
                  btnMoreOpenRef.current?.classList?.toggle("hidden");
            }}
            className="sm:hidden hidden absolute cursor-pointer"
          >
            <BiGridAlt className="text-2xl" />
          </div>
          <div
            ref={btnMoreRef}
            className=" sm:text-2xl text-xl min-w-[auto]  ease-linear duration-300  sm:gap-3 gap-2 flex justify-between items-center"
          >
            <Tooltip
              title={!isOpenMoreChat ? t("openMore") : t("closeopenMore")}
              componentsProps={componentsProps}
              arrow
              placement="top"
            >
              <span
                onClick={(e) => {
                  setIsOpenMoreChat(!isOpenMoreChat), e.stopPropagation();
                }}
                className="cursor-pointer"
              >
                <BiDotsHorizontalRounded />
              </span>
            </Tooltip>
            <Tooltip
              title={t("img")}
              componentsProps={componentsProps}
              arrow
              placement="top"
            >
              <label
                htmlFor="uploadfile"
                onClick={() => setIsOpenFile(!isOpenModuleFile)}
                className="cursor-pointer"
              >
                <BiImages />
              </label>
            </Tooltip>

            <Tooltip
              title="Emoji"
              componentsProps={componentsProps}
              arrow
              placement="top"
            >
              <span
                className="cursor-pointer"
                onClick={Debounced(() => setIsOpenEmoji(!isOpenEmoji), 400)}
              >
                <BiSmile />
              </span>
            </Tooltip>

            <Tooltip
              key="micmobile"
              title={`${isOpenEVoices ? t("turnoff") : t("open")} Voices`}
              componentsProps={componentsProps}
              arrow
              placement="top"
              onClick={Debounced(handleCallVoices, 100)}
            >
              <button className="sm:hidden">
                {isOpenEVoices ? <BiMicrophone /> : <BiMicrophoneOff />}
              </button>
            </Tooltip>
          </div>

          <div className="flex items-center ease-out duration-200  w-full ml-3 sm:ml-2  p-2  rounded-sm">
            {!loading ? (
              <TextareaAutosize
                ref={chattingRef}
                onFocus={() => handleForcusChatting(true)}
                onTouchStart={() => handleForcusChatting(true)}
                onBlur={() => handleForcusChatting(false)}
                className="py-3 block min-w-[30px] form-control border-[1px] px-3 text-sm  outline-0 border-none   flex-1 rounded-lg"
                placeholder={t("chatMessage")}
                maxRows={6}
                minRows={1}
                maxLength={600}
                minLength={2}
              ></TextareaAutosize>
            ) : (
              <LoadingDot />
            )}
          </div>

          <div className=" sm:min-w-[100px]  justify-around items-center flex">
            <Tooltip
              title={`${isOpenEVoices ? t("turnoff") : t("open")} Voices`}
              componentsProps={componentsProps}
              arrow
              placement="top"
              onClick={Debounced(handleCallVoices, 100)}
            >
              <button className="sm:block hidden">
                {isOpenEVoices ? (
                  <BiMicrophone fontSize={deFaultIconSize} />
                ) : (
                  <BiMicrophoneOff fontSize={deFaultIconSize} />
                )}
              </button>
            </Tooltip>

            <span
              onClick={() => {
                if (loading) {
                  return;
                }
                if (chattingRef.current) {
                  handleSubmitMessage();
                }
              }}
              className="btn_send-chatting hover:opacity-80 sm:py-2.5 cursor-pointer sm:px-3 py-1.5 px-2 rounded-xl"
            >
              {loading ? (
                <BiLoaderCircle
                  className="animate-spin"
                  fontSize={deFaultIconSize}
                />
              ) : (
                <BiSend fontSize={deFaultIconSize} />
              )}
            </span>
          </div>
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "absolute bottom-[80px] left-1 sm:left-10",
            isOpenEmoji ? "block" : "hidden"
          )}
        >
          <Picker
            data={data}
            previewPossition="none"
            onEmojiSelect={handdleSelect}
          />
        </div>
        <div
          onClick={() => setIsOpenMoreChat(false)}
          className={cn(
            "overflow-hidden grid sm:grid-cols-6 grid-cols-4 text-xs ease-in duration-100",
            isOpenMoreChat ? "h-20 " : "h-0 "
          )}
        >
          <div
            onClick={() => setIsOpenGhim((prev: any) => !prev)}
            className="flex items-center cursor-pointer justify-center flex-col"
          >
            <img width={40} src="/images/ghim.png" alt="" />
            <p className="mt-1">Ghim</p>
          </div>
          <div
            onClick={handleGetLocation}
            className="flex items-center cursor-pointer justify-center flex-col "
          >
            <img width={40} src="/images/locationghim.png" alt="" />
            <p className="mt-1 capitalize">{t("location")}</p>
          </div>
          <label
            htmlFor="uploaddoccument"
            className="flex items-center cursor-pointer justify-center flex-col"
          >
            <img width={40} src="/images/documentsbg.png" alt="" />
            <input
              onChange={handleSubmitDocument}
              type="file"
              id="uploaddoccument"
              className="hidden"
            />
            <p className="mt-1">{t("document")}</p>
          </label>

          <div
            onClick={() => setIsOpenSpeakVoice(!isOpenSpeakVoice)}
            className="flex items-center cursor-pointer justify-center flex-col"
          >
            <img width={40} src="/images/microphone.png" alt="" />
            <p className="mt-1">{t("record")}</p>
          </div>
        </div>
        {/* isOpenSpeakVoice Openvoice upload file */}
        {isOpenSpeakVoice && (
          <div className="h-32  bg-follow-darkmode absolute bottom-0 left-0 w-full z-10 flex  justify-center items-center">
            <span
              className="text-3xl cursor-pointer absolute right-2 top-2"
              onClick={() => setIsOpenSpeakVoice(false)}
            >
              <BiX />
            </span>
            <RecorderComponent
              setIsOpenSpeakVoice={setIsOpenSpeakVoice}
              handleSendMessage={handleSendMessage}
            />
          </div>
        )}
        {/*end  isOpenSpeakVoice Openvoice upload file */}
      </section>
    </>
  );
};

export default ChatInputPerSon;

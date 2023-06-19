import { FC, useRef, useState, useEffect, useCallback } from "react";

import {
  BiGridAlt,
  BiLoaderCircle,
  BiMicrophone,
  BiMicrophoneOff,
  BiSend,
} from "react-icons/bi";
import { TextareaAutosize } from "@mui/base";
import { Tooltip } from "@mui/material";

import { nanoid } from "nanoid";
import { messageType } from "./chat.type";
import { LoadingDot } from "../loading";
import { HandleCoverSpeaktoText } from "../webmedia";
import {
  Debounced,
  ToastNotify,
  cn,
  deFaultIconSize,
} from "../../servies/utils";
import ChatInputOptionsMore, { TlistSwipper } from "../Ui/ChatInputOptionsMore";
import { componentsProps } from "../../styles/componentsProps";
import SelectionOptions from "./component/SelectionOptions";
import { optionsImage, optionsTranscriptions } from "./chat.utils";

interface ChatInputProps {
  mutationQuery: (message: messageType) => void;
  loading: boolean;
  fileCallback?: (file: File) => void;
  className: string;
  valueDefalutSearch: string;
}

const ChatInput: FC<ChatInputProps> = ({
  valueDefalutSearch = "Đặt câu hỏi bạn nhé ...",
  mutationQuery,
  loading,
  fileCallback,
  className,
}) => {
  const [isOpenEVoices, setIsOpenVoices] = useState<boolean>(false);
  const btnMoreRef = useRef<HTMLDivElement>(null);
  const btnMoreOpenRef = useRef<HTMLDivElement>(null);
  const chattingRef = useRef<HTMLTextAreaElement>(null);
  const [isOpenSubOption, setIsOpenSubOptions] = useState<boolean>(false);
  const [TitleSubOption, setTitleSubOptions] = useState<string>("");

  const [ListOptions, setListOptions] = useState<
    { title: string; value: string }[]
  >([]);

  const handleSubmitMessage = () => {
    let messages: messageType | any = {};
    if (chattingRef.current) {
      messages = {
        isUserMessage: true,
        id: nanoid(),
        text: chattingRef.current.value.trim(),
      };
      // add message to api
      if (!messages.text) {
        return;
      }

      mutationQuery(messages);

      messages = {};
      const text = chattingRef.current.value;
      setIsOpenSubOptions(false);
      const match = text.match(/\*\*(.*?)\*\*/);

      if (match) {
        const matchedValue = match[1];
        chattingRef.current.value = `**${matchedValue}**`;
        chattingRef.current.innerText = `**${matchedValue}**`;
      } else {
        chattingRef.current.value = "";
      }
      chattingRef.current.blur();
    }
  };
  useEffect(() => {
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

      if (chattingRef.current) {
        chattingRef.current.value = "";
      }
    };
  }, []);
  const callbackText = useCallback((str: string | boolean | any) => {
    setIsOpenVoices(false);
    if (str && chattingRef.current) {
      chattingRef.current.value = str;
    }
  }, []);
  const handleChoseSetting = (settings: TlistSwipper) => {
    if (chattingRef.current) {
      if (settings.type == "img") {
        setListOptions(optionsImage);
        setTitleSubOptions("Kich thước ảnh ?");
        setIsOpenSubOptions(true);
      } else if (settings.type == "translate") {
        setTitleSubOptions("Dịch sang ngôn ngữ ?");
        setListOptions(optionsTranscriptions);
        setIsOpenSubOptions(true);
      } else {
        setIsOpenSubOptions(false);
      }
      chattingRef.current.value = `**${settings.type}**`;
      if (settings.type != "location") {
        chattingRef.current.focus();
      } else {
        chattingRef.current.value = `**${settings.type}** `;
        ToastNotify("Nhập địa điểm muốn tìm hoặc bấm nút enter?").info({
          autoClose: 4000,
        });
      }
    }
  };
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
    if (window.innerWidth < 560) {
      if (isForcus) {
        btnMoreRef.current?.classList.add("hidden__effect");
        btnMoreOpenRef.current?.classList.remove("hidden");
      } else {
        btnMoreRef.current?.classList.remove("hidden__effect");
        btnMoreOpenRef.current?.classList.add("hidden");
      }
    }
  };

  const optionCallback = (value: string) => {
    if (chattingRef.current) {
      if (chattingRef.current.value.includes("**")) {
        const props = chattingRef.current.value.split("**").filter((p) => p);
        if (props.length == 1) {
          props.push(value);
        } else if (props.length >= 2) {
          props[1] = value;
        }
        chattingRef.current.value = "**" + props.join("**") + "**";
        setIsOpenSubOptions(false);
      } else {
        setIsOpenSubOptions(false);
      }
    }
  };

  return (
    <section
      className={cn(
        "absolute bg-follow-darkmode  bottom-0 left-0 right-0 sm:p-4 py-4 px-3",

        className
      )}
    >
      <div className="flex  justify-between w-full overflow-x-hidden  sm:gap-4 gap-2 items-center h-full">
        <div
          ref={btnMoreOpenRef}
          title="Mở rộng"
          onTouchStart={() => {
            handleForcusChatting(false),
              window.innerWidth < 640 &&
                btnMoreOpenRef.current?.classList?.toggle("hidden");
          }}
          className="sm:hidden hidden absolute cursor-pointer min-w-[60px]"
        >
          <BiGridAlt className="text-2xl" />
        </div>
        <div
          ref={btnMoreRef}
          className=" sm:text-2xl text-xl min-w-[auto]  ease-linear duration-300  sm:gap-3 gap-2 flex justify-between items-center"
        >
          {/* Button More Chatinput */}

          <ChatInputOptionsMore
            fileCallback={fileCallback}
            handleChoseSeeting={handleChoseSetting}
          />

          {/* end Button More Chatinput */}

          <Tooltip
            key="micmobile"
            title={isOpenEVoices ? "Tắt Vocies" : "Mở Voices"}
            componentsProps={componentsProps}
            arrow
            placement="top"
            onClick={Debounced(handleCallVoices, 100)}
          >
            <button>
              {isOpenEVoices ? <BiMicrophone /> : <BiMicrophoneOff />}
            </button>
          </Tooltip>
        </div>

        <div className="flex items-center ease-out duration-200  ml-4 w-full  px-2   p-2  rounded-sm">
          {!loading ? (
            <TextareaAutosize
              ref={chattingRef}
              onFocus={() => handleForcusChatting(true)}
              onTouchStart={() => handleForcusChatting(true)}
              onBlur={() => handleForcusChatting(false)}
              className="py-3 block min-w-[60px] form-control border-[1px] px-3 text-sm  outline-0 border-none   flex-1 rounded-lg"
              placeholder="Lời nhắn..."
              defaultValue={valueDefalutSearch}
              maxRows={6}
              minRows={1}
              maxLength={600}
              minLength={2}
            ></TextareaAutosize>
          ) : (
            <LoadingDot />
          )}
        </div>

        <div className="sm:px-2 justify-around items-center flex">
          <button
            onClick={() => {
              if (loading) {
                ToastNotify("Vui lòng chời trong ít lát ...").error();
                return;
              }
              handleSubmitMessage();
            }}
            className="btn_send-chatting hover:opacity-80 sm:py-2.5 sm:px-3 py-1.5 px-2 rounded-xl"
          >
            {loading ? (
              <BiLoaderCircle
                className="animate-spin"
                fontSize={deFaultIconSize}
              />
            ) : (
              <BiSend fontSize={deFaultIconSize} />
            )}
          </button>
        </div>
      </div>

      {isOpenSubOption && (
        <SelectionOptions
          title={TitleSubOption}
          optionCallback={optionCallback}
          options={ListOptions}
        />
      )}
    </section>
  );
};

export default ChatInput;

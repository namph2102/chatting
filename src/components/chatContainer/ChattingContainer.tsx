import { useState, useRef, useReducer, useEffect } from "react";
import { useMutation } from "react-query";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";
import ChatContent from "./ChatContent";
import { messageType } from "./chat.type";
import { nanoid } from "nanoid";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import xml from "highlight.js/lib/languages/xml";
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("xml", xml);
import "./chating.scss";
import {
  CommentReducer,
  HandleCoverStringEntries,
  StoreCommentChatBot,
  handleAddComment,
  handleCoverComment,
  initState,
} from "./chat.utils";
import { ScroolToBottom, ToastNotify, cn } from "../../servies/utils";
import { RootState } from "../../redux";
import { useSelector } from "react-redux";

import openaiStream from "../../servies/streamchatbox/openai-stream";
import { Spotify } from "./component/spotify/spotify.contant";
import { getLocation } from "./component/loadmap/index.util";
import { personInit } from "../../redux/Slice/ChatPersonSlice";
import { useTranslation } from "react-i18next";
import "../../servies/translate/contfigTranslate";

const controller = new AbortController();

const ChattingContainer = () => {
  const { t } = useTranslation();
  initState.comment = t("commentChatBot");
  const [listUserComments, dispatch] = useReducer(
    CommentReducer,
    StoreCommentChatBot.length <= 1 ? [initState] : StoreCommentChatBot
  );
  const [isLoadding, setIsLoadding] = useState<boolean>(false);
  const [valueDefalutSearch, setValueDefaultSearch] = useState<string>("");
  const boxChatContentRef = useRef<HTMLElement>(null);
  const contentSlideAnimation = useRef<HTMLDivElement>(null);
  const [fileUpload, setFileUpload] = useState<File>();
  const { theme, account } =
    useSelector((state: RootState) => state.userStore) || {};
  useEffect(() => {
    if (contentSlideAnimation.current) {
      hljs.highlightBlock(contentSlideAnimation.current);
      document.addEventListener("DOMContentLoaded", () => {
        hljs.highlightAll();
      });
    }
    if (boxChatContentRef.current) {
      ScroolToBottom(boxChatContentRef.current, 100);
    }
  }, []);

  const mutation = useMutation({
    mutationFn: async (message: messageType) => {
      if (message.text && message.text.includes("**")) {
        const newCheck = message.text.split("**");
        if (newCheck.length <= 2) {
          const coverText: string[] = message.text
            .replace(/\*/g, "")
            ?.split(" ");
          if (coverText.length < 1) throw new Error(t("infomationNotEnough"));

          message.text =
            coverText.slice(1, coverText.length).join(" ") || message.text;
          setValueDefaultSearch("");
        }
      }
      dispatch(
        handleAddComment({
          id: nanoid(),
          isUser: true,
          avatar: account.avatar,
          type: "text",
          comment: HandleCoverStringEntries(message.text.trim()),
          time: getTime(),
          isSee: true,
        })
      );
      setIsLoadding(true);
      if (boxChatContentRef.current) {
        ScroolToBottom(boxChatContentRef.current, 100);
      }

      const idItemout = setTimeout(() => {
        controller.abort();
        clearTimeout(idItemout);
      }, 30000);
      return message;
    },
    onSuccess: async (message) => {
      let typeChatting = "text";
      let reply: any = "";
      const handleGetValueTyping = async (content: string) => {
        reply += content;
        if (contentSlideAnimation.current) {
          contentSlideAnimation.current.innerText = reply;

          if (boxChatContentRef.current) {
            reply.length % 10 == 0 &&
              ScroolToBottom(boxChatContentRef.current, 2);
          }
        }
      };

      // handle chose setting
      if (message.text.includes("**img**")) {
        const prompt: string = message.text.includes("**img**")
          ? message.text.replace("**img**", "")
          : message.text.trim();
        let size = "512";
        let des = prompt;
        if (prompt.includes("**")) {
          size = prompt.split("**")[0].trim();
          if (size != "512" && size != "1024" && size != "256" && !size) {
            size = "512";
          }
          des = prompt.split("**")[1].trim();
        }
        if (!prompt) {
          throw new Error(
            ` Xin lỗi bạn ! Vui lòng nhập đúng cú pháp.        
Cú pháp: **img**	size(1024,512,216)** &lt; Nội dung ảnh &gt; - Vui lòng nhập tên ảnh cần tìm ?
Ví dụ: **img** 1024** Ảnh mèo con dễ thương hoặc là **img** con mèo dễ thương`
          );
        }
        setValueDefaultSearch("**img**");

        typeChatting = "image";

        const test = await openaiStream.createImage(des, `${size}x${size}`);
        const data: { url: string }[] = await test.data;

        reply =
          data?.length > 1
            ? data.map((item) => ({ id: nanoid(), url: item.url }))
            : [];
      } else if (message.text.includes("**location**")) {
        // get laodmap
        typeChatting = "location";

        const prompt: string = message.text.includes("**location**")
          ? message.text.replace("**location**", "")
          : message.text.trim();
        setValueDefaultSearch("**location**");
        //kéo xuống cùng
        if (boxChatContentRef.current) {
          ScroolToBottom(boxChatContentRef.current, 2000);
        }
        reply = prompt;
      } else if (message.text.includes("**youtube**")) {
        const seacrh: string = message.text.replace("**youtube**", "") || "";
        if (!seacrh) {
          throw new Error(
            `${t("syntax")}: **youtube**	&lt;${t("type")} ${t("keyword")} &gt; `
          );
        }
        typeChatting = "youtube";
        setValueDefaultSearch("**youtube**");
        reply = await openaiStream.getListYoutube(seacrh, 12);
        if (!reply) {
          throw new Error(t("severError"));
        }
      } else if (message.text.includes("**weather**")) {
        const search = message.text.replace("**weather**", "").trim();
        if (search) {
          const responsive = await getLocation(search);
          const data: { lat: string; lon: string; display_name: string } =
            await responsive.data[0];

          reply = `${t("weather")}  ${data.display_name}*${data.lat}*${
            data.lon
          }`;
        } else {
          reply = `${t("weatherNow")}*0*0`;
        }
        // show thời tiết
        typeChatting = "weather";

        setValueDefaultSearch("**weather**");

        boxChatContentRef.current &&
          ScroolToBottom(boxChatContentRef.current, 4000);
      } else if (message.text.includes("**mp3**")) {
        // tìm kiếm theo keyword
        const seacrh: string = message.text.replace("**mp3**", "") || "";
        if (!seacrh) {
          ToastNotify(`${t("type")} ${t("keyword")}`).info();
        }
        typeChatting = "mp3";

        try {
          const listSpotify: Spotify = await openaiStream.getListSearchSpotify(
            seacrh
          );

          if (listSpotify && listSpotify.song?.length > 0) {
            reply = listSpotify;
          }
        } catch (err: { message: string } | any) {
          reply = err.message;
        }
        setValueDefaultSearch("**mp3**");
      } else if (message.text.includes("**translate**")) {
        const proms: string = message.text.replace("**translate**", "") || "";
        let language = "en";
        if (proms.includes("**")) {
          language = proms.split("**")[0].trim() || "en";
        }
        if (!fileUpload) throw new Error(`File ${t("not")} ${t("format")}`);
        ToastNotify(t("plsWating")).success({
          autoClose: 5000,
        });
        reply = `File Audio ${t("have")} ${t("content")}:<br/>
         ${await openaiStream.getTextInAudio(fileUpload, language)} `;
        typeChatting = "translate";
        if (!reply) {
          throw new Error(t("severError"));
        }

        setValueDefaultSearch("");
      } else {
        setValueDefaultSearch("");
        await openaiStream.createMessage(message, handleGetValueTyping);
      }

      if (boxChatContentRef.current) {
        ScroolToBottom(boxChatContentRef.current, 1000);
      }

      if (typeChatting == "text") {
        reply = hljs.highlightAuto(handleCoverComment(reply)).value || "";
      } else {
        reply = reply || "";
      }
      dispatch(
        handleAddComment({
          id: nanoid(),
          isUser: false,
          avatar: personInit.avatar || "/images/botai.png",
          comment: reply,
          type: typeChatting,
          time: getTime(),
          isSee: true,
        })
      );

      if (boxChatContentRef.current) {
        ScroolToBottom(boxChatContentRef.current, 400);

        if (contentSlideAnimation.current) {
          contentSlideAnimation.current.innerHTML = "";
        }
      }
      setIsLoadding(false);
    },
    onError: async (err: Error) => {
      setIsLoadding(false);
      //add comment chatbox when error
      dispatch(
        handleAddComment({
          id: nanoid(),
          isUser: false,
          type: "text",
          avatar: personInit.avatar || "/images/botai.png",
          comment: err.message,
          time: getTime(),
          isSee: true,
        })
      );
      if (boxChatContentRef.current) {
        ScroolToBottom(boxChatContentRef.current, 300);
      }
    },
  });

  const { isOpenChat } = useSelector((state: RootState) => state.userStore);

  return (
    <div
      id={theme.darkmode}
      style={{ backgroundImage: `url(${theme.backgroundthem})` }}
      className={cn(
        "w-full lg:relative  fixed inset-0 z-20 ",

        !isOpenChat ? "open_toggle-mobile" : "hidden_toggle-mobile"
      )}
    >
      <ChatHeader person={personInit} />

      <section
        ref={boxChatContentRef}
        className="chatting px-2 pb-4 overflow-y-auto absolute top-0 left-0  bottom-24 pt-24 overflow-x-hidden w-full"
      >
        {listUserComments.length > 0 &&
          listUserComments.map((comment) => (
            <ChatContent {...comment} key={comment.id} />
          ))}

        <div className="font_inter-chatting whitespace-pre-wrap mt-4">
          <p className="rounded-xl whitespace-pre-wrap px-3">
            <code
              className="language-javascript mb-4 sm:mb-2"
              ref={contentSlideAnimation}
            ></code>
          </p>
        </div>
      </section>
      <ChatInput
        valueDefalutSearch={valueDefalutSearch}
        className={!isOpenChat ? "open_toggle-mobile" : "hidden_toggle-mobile"}
        loading={isLoadding}
        fileCallback={setFileUpload}
        mutationQuery={mutation.mutate}
      />
    </div>
  );
};

export default ChattingContainer;
function getTime(): string {
  return new Date().toISOString();
}

import { useState, useRef, useReducer, useEffect } from "react";
import { useMutation } from "react-query";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";
import ChatContent, { ChatContentProps } from "./ChatContent";
import { messageType } from "./chat.type";
import { nanoid } from "nanoid";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import xml from "highlight.js/lib/languages/xml";
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("xml", xml);
import "./chatting.scss";
import {
  CommentReducer,
  handleAddComment,
  handleCoverComment,
} from "./chat.utils";
import { ScroolToBottom, ToastNotify, cn } from "../../servies/utils";
import { RootState } from "../../redux";
import { useSelector } from "react-redux";

import openaiStream from "../../servies/streamchatbox/openai-stream";
import { Spotify } from "./component/spotify/spotify.contant";
import { getLocation } from "./component/loadmap/index.util";

const initState: ChatContentProps[] = [
  {
    id: "chatbox",
    comment:
      "Chào mừng bạn đến với trang web zecky.online! Bạn cần giúp đỡ gì ạ!",
    isUser: false,
    time: getTime(),
    type: "text",
    isSee: true,
  },
];
const controller = new AbortController();

const ChattingContainer = () => {
  const [listUserComments, dispatch] = useReducer(CommentReducer, initState);
  const [isLoadding, setIsLoadding] = useState<boolean>(false);
  const [valueDefalutSearch, setValueDefaultSearch] = useState<string>("");

  const boxChatContentRef = useRef<HTMLElement>(null);
  const contentSlideAnimation = useRef<HTMLDivElement>(null);
  const [fileUpload, setFileUpload] = useState<File>();
  const { theme } = useSelector((state: RootState) => state.userStore) || {};

  useEffect(() => {
    if (contentSlideAnimation.current) {
      hljs.highlightBlock(contentSlideAnimation.current);
      document.addEventListener("DOMContentLoaded", () => {
        hljs.highlightAll();
      });
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
          if (coverText.length < 1)
            throw new Error("Vui lòng cung cấp thêm thông tin ?");

          message.text =
            coverText.slice(1, coverText.length).join(" ") || message.text;
          setValueDefaultSearch("");
        }
      }
      // add comment suer chat
      dispatch(
        handleAddComment({
          id: nanoid(),
          isUser: true,
          type: "text",
          comment: message.text.trim(),
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
          contentSlideAnimation.current.innerHTML = `<span class="block mb-4">${reply}</span>`;

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
          throw new Error("Cú pháp: **youtube**	&lt; Nhập từ khóa &gt; ");
        }
        typeChatting = "youtube";
        setValueDefaultSearch("**youtube**");
        reply = await openaiStream.getListYoutube(seacrh, 12);
        if (!reply) {
          throw new Error(
            "Hiện tại máy chủ bị lỗi! Bạn vui lòng liên hệ Admin Zecky nha!"
          );
        }
      } else if (message.text.includes("**weather**")) {
        const search = message.text.replace("**weather**", "").trim();
        if (search) {
          const responsive = await getLocation(search);
          const data: { lat: string; lon: string; display_name: string } =
            await responsive.data[0];

          reply = `Thời tiết tại ${data.display_name}*${data.lat}*${data.lon}`;
        } else {
          reply = "Thời tiết hôm nay của bạn*0*0";
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
          ToastNotify("Bạn vui lòng nhập từ khóa").info();
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
        if (!fileUpload) throw new Error("Có lẽ chưa tải file dúng yêu cầu?");
        ToastNotify("Vui lòng chờ đợi trong ít giây bạn nhé!").success({
          autoClose: 5000,
        });
        reply = `File Audio của bạn Có nội dung là:<br/>
         ${await openaiStream.getTextInAudio(fileUpload, language)} `;
        typeChatting = "translate";
        if (!reply) {
          throw new Error("Xin lỗi hệ thống đang quá tải!");
        }

        setValueDefaultSearch("");
      } else {
        setValueDefaultSearch("");
        await openaiStream.createMessage(message, handleGetValueTyping);
      }

      if (boxChatContentRef.current) {
        ScroolToBottom(boxChatContentRef.current, 1000);
      }
      // const regex = /https?:\/\/[^\s]+/g;
      // const links = [...(reply.match(regex) || [])] || [];
      // console.log(links);
      if (typeChatting == "text") {
        reply = hljs.highlightAuto(handleCoverComment(reply)).value || "";
      } else {
        reply = reply || "";
      }
      dispatch(
        handleAddComment({
          id: nanoid(),
          isUser: false,
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
      <ChatHeader id="chatwithbotai" />

      <section
        ref={boxChatContentRef}
        className="chatting px-2 absolute top-0 left-0 right-0 overflow-y-auto overflow-x-hidden w-full pt-14 max-h-[calc(100vh-100px)]"
      >
        {listUserComments.length > 0 &&
          listUserComments.map((comment) => (
            <ChatContent {...comment} key={comment.id} />
          ))}

        <div className="whitespace-pre-wrap mt-4">
          <p className="rounded-xl whitespace-pre-wrap px-3">
            <code
              className="language-javascript "
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
  const datenew = new Date();
  const time =
    datenew.getHours().toString().padStart(2, "0") +
    ":" +
    datenew.getMinutes().toString().padStart(2, "0");
  return time;
}

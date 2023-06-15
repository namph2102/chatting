import { FC, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { PserSonChating } from "../../redux/Slice/ChatPersonSlice";
import ChatHeader from "../chatContainer/ChatHeader";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { ScroolToBottom, cn } from "../../servies/utils";
import ChatInputPerSon from "./ChatInputPerSon";
import { handleRoomChat } from "./util";
import ChatUserPersonItem, {
  ChatUserPersonItemProps,
} from "./component/ChatUserPersonItem";
import { nanoid } from "@reduxjs/toolkit";
const domainSever = import.meta.env.VITE_DOMAIN_SEVER;
export const socket = io(domainSever, { transports: ["websocket"] });

interface ChatPerSonContainerProps {
  person: PserSonChating;
}

const ChatPerSonContainer: FC<ChatPerSonContainerProps> = ({ person }) => {
  const [listUserComments, setListUserComments] = useState<
    ChatUserPersonItemProps[]
  >([]);
  const { theme, account } =
    useSelector((state: RootState) => state.userStore) || {};
  const { isOpenChat } = useSelector((state: RootState) => state.userStore);
  useEffect(() => {
    if (!person._id) return;
    socket.emit("client-acttaced-id", person._id);
    socket.on("person-offline", () => {
      console.log("Người kia đã offline");
    });
    handleRoomChat(account._id, person._id).then((res) => {
      if (res.status == 200) {
        const infoRoom = res.data;
        const idRoom = infoRoom.room._id;

        const listNewChatting: ChatUserPersonItemProps[] =
          infoRoom.listChatting.map((acc: any) => {
            acc.isUser = account._id == acc.author._id;
            return acc;
          });
        console.log(listNewChatting);
        if (listNewChatting?.length > 0) {
          setListUserComments([...listNewChatting]);
        }
        socket.emit("tao-room", idRoom);
      }
    });
    socket.on("server-chat", (data: ChatUserPersonItemProps) => {
      console.log("sever-data", data);
      data.isUser = false;
      data.author.avatar = person.avatar;
      setListUserComments((pre) => [...pre, data]);
      if (boxChatContentRef.current) {
        ScroolToBottom(boxChatContentRef.current, 100);
      }
    });
    // client-side
    socket.on("connect", () => {
      console.log("client connect", socket.id); //
    });

    socket.on("disconnect", () => {
      console.log("client disconect connect", socket.id); // undefined
    });
  }, [person._id]);
  const handleSendMessage = (
    inputElement: HTMLTextAreaElement,
    type: string
  ) => {
    const data: ChatUserPersonItemProps = {
      idSee: person.status,
      updatedAt: new Date().toISOString(),
      author: {
        _id: account._id,
        avatar: account.avatar,
        fullname: account.fullname,
      },
      comment: inputElement.value.trim().replace(/\s{2}/g, " "),
      isUser: true,
    };

    setListUserComments([...listUserComments, data]);
    socket.emit("user-chat", { ...data, type });
    if (boxChatContentRef.current) {
      ScroolToBottom(boxChatContentRef.current, 100);
    }
  };
  const boxChatContentRef = useRef<HTMLElement>(null);
  return (
    <div
      id={theme.darkmode}
      style={{ backgroundImage: `url(${theme.backgroundthem})` }}
      className={cn(
        "w-full lg:relative  fixed inset-0 z-20 ",

        !isOpenChat ? "open_toggle-mobile" : "hidden_toggle-mobile"
      )}
    >
      <ChatHeader person={person} />

      <section
        ref={boxChatContentRef}
        className="chatting px-2 absolute top-0 left-0 right-0 overflow-y-auto overflow-x-hidden w-full pt-24 max-h-[calc(100vh-100px)]"
      >
        {listUserComments.length > 0 &&
          listUserComments.map((comment) => (
            <ChatUserPersonItem key={nanoid()} {...comment} />
          ))}
      </section>

      <ChatInputPerSon
        loading={false}
        handleSendMessage={handleSendMessage}
        className={!isOpenChat ? "open_toggle-mobile" : "hidden_toggle-mobile"}
      />
    </div>
  );
};

export default ChatPerSonContainer;

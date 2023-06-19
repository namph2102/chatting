import { FC, useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  PserSonChating,
  updatePersonStatus,
} from "../../redux/Slice/ChatPersonSlice";
import ChatHeader from "../chatContainer/ChatHeader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { ScroolToBottom, ToastNotify, cn } from "../../servies/utils";
import ChatInputPerSon from "./ChatInputPerSon";
import { handleRoomChat } from "./util";
import ChatUserPersonItem, {
  ChatUserPersonItemProps,
} from "./component/ChatUserPersonItem";

import { IImageFireBase } from "./component/MyDropzone";
import handleImageFirebase from "./util/handleImageFirebase";

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
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    let idRoom = "";

    if (!person._id) return;
    // lắng nghe user chat off hay on
    socket.on(`friend-chattings-${person._id}`, (status) => {
      dispatch(
        updatePersonStatus({
          status: status,
          updatedAt: new Date().toISOString(),
        })
      );
    });

    handleRoomChat(account._id, person._id).then((res) => {
      if (res.status == 200) {
        const infoRoom = res.data;
        idRoom = infoRoom.room._id;

        if (infoRoom.person) {
          dispatch(
            updatePersonStatus({
              status: infoRoom.person.status,
              updatedAt: infoRoom.person.updatedAt,
            })
          );
        }
        console.log("re-render");
        const listNewChatting: ChatUserPersonItemProps[] =
          infoRoom.listChatting.map((acc: any) => {
            acc.isUser = account._id == acc.author._id;
            acc.isAction = acc.action.userId == acc.author._id;
            if (acc.file?.length > 0) {
              if (acc.author._id != account._id && acc.action.userId) {
                acc.type = "text";
              }
            }
            return acc;
          });

        if (listNewChatting?.length > 0) {
          setListUserComments([...listNewChatting]);
          if (boxChatContentRef.current) {
            ScroolToBottom(boxChatContentRef.current, 300);
          }
        }
        socket.emit("tao-room", idRoom);
      }
    });

    return () => {
      setListUserComments([]);
      socket.emit("leaver-room-chat-current", idRoom);
    };
  }, [account._id, person._id]);
  // lắng nghe và sẽ thực hiện thao tác thêm sữa xóa ************************
  useEffect(() => {
    if (!account._id) return;
    socket.on("server-send-chatting-change", ({ action, idComment }) => {
      setListUserComments((listUserComments: ChatUserPersonItemProps[]) => {
        const acc: any = listUserComments.find((chat) => chat._id == idComment);
        console.log(action);
        console.log("****************************");
        console.log(acc.author._id, action.userId, account._id);
        acc.isAction = acc.author._id == action.userId;
        console.log("isaction", acc.isAction);
        if (!acc) return listUserComments;

        acc.action = action;
        if (acc.type == "image") {
          if (acc.isAction && account._id == action.userId) {
            const listFile: IImageFireBase[] = acc.file;
            listFile.map((file) => handleImageFirebase.deleteImage(file.path));
            acc.file = [];
            acc.type = "text";
          } else if (acc.isAction && account._id != action.userId) {
            acc.type = "text";
          } else if (!acc.isAction && account._id == action.userId) {
            acc.type = "text";
          } else {
            acc.type = "image";
          }
        }
        console.log(acc);
        return [...listUserComments];
      });
    });
  }, [account._id]);
  console.log("****************************re-render******************");
  const handleactiveOptions = (
    idComment: string | undefined,
    type: string,
    typeChatting: string
  ) => {
    if (type == "delete") {
      const data: any = {
        id: idComment,
        userId: account._id,
        type,
        typeChatting,
      };
      socket.emit(`client-send-chatting-change`, data);
    }
  };

  const handleScrool = useCallback(() => {
    if (boxChatContentRef.current) {
      ScroolToBottom(boxChatContentRef.current, 200);
    }
  }, []);
  useEffect(() => {
    // client-side
    socket.on("connect", () => {
      console.log("client connect", socket.id); //
    });

    socket.on("disconnect", () => {
      console.log("client disconect connect", socket.id); // undefined
    });
    socket.on("server-chat", (data: ChatUserPersonItemProps) => {
      data.isUser = false;
      data.author.avatar = person.avatar;
      setListUserComments((pre) => [...pre, data]);
      handleScrool();
      setIsLoading(false);
      console.log(data.isSee);
    });
    socket.on("user-chat-message", (data) => {
      setListUserComments((prev) => [...prev, data]);
      handleScrool();
      setIsLoading(false);
      if (data.isSee) {
        if (person.status) return;
        socket.on("person-friend-online", () => {
          dispatch(
            updatePersonStatus({
              status: data.isSee,
            })
          );
        });
      }
    });
  }, []);

  const handleSendMessage = useCallback(
    (inputElement: HTMLTextAreaElement | any[] | any, type: string) => {
      let listImage: IImageFireBase[] = [];
      if (type == "image") {
        listImage = inputElement;
        if (listImage.length <= 0) {
          ToastNotify("Gửi ảnh không thành công!").info();
          return;
        }
      } else if (type == "text") {
        if (!inputElement.value) {
          return;
        }
      }

      const data: ChatUserPersonItemProps = {
        isSee: person.status,

        updatedAt: new Date().toISOString(),
        type,
        author: {
          _id: account._id,
          avatar: account.avatar,
          fullname: account.fullname,
        },
        comment:
          type == "image"
            ? "uploadfile"
            : inputElement.value.trim().replace(/\s{2}/g, " "),
        isUser: true,
        action: {
          kind: "",
          userId: "",
        },
      };
      socket.emit("user-chat", {
        ...data,
        idPerson: person._id,
        type,
        file: listImage,
      });
      setIsLoading(true);
    },
    []
  );
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
            <ChatUserPersonItem
              key={comment._id}
              {...comment}
              handleactiveOptions={handleactiveOptions}
            />
          ))}
      </section>

      <ChatInputPerSon
        loading={isLoading}
        handleSendMessage={handleSendMessage}
        className={!isOpenChat ? "open_toggle-mobile" : "hidden_toggle-mobile"}
      />
    </div>
  );
};

export default ChatPerSonContainer;

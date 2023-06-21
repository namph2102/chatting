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
import { containsLink, handleRoomChat } from "./util";
import ChatUserPersonItem, {
  ChatUserPersonItemProps,
} from "./component/ChatUserPersonItem";

import { IImageFireBase } from "./component/MyDropzone";
import handleImageFirebase from "./util/handleImageFirebase";
import ModalProviderOverlay from "../Ui/ModalProviderOverlay";

import GhimContainer from "./component/GhimContainer";
import { HandleCoverStringEntries } from "../chatContainer/chat.utils";
import { crawLinkChating } from "../../pages/CrawlWebsite/component/CrawLink";

import LoadingContainer from "../loading/LoadingContainer";

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
  const [loadingFullPage, setLoadingFullpage] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setLoadingFullpage(true);
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

    handleRoomChat(account._id, person._id)
      .then((res) => {
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

          const listNewChatting: ChatUserPersonItemProps[] =
            infoRoom.listChatting.map((acc: any) => {
              acc.isUser = account._id == acc.author._id;
              acc.isAction = acc.action.userId == acc.author._id;
              acc.idAccount = account._id;
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
      })
      .finally(() => {
        setLoadingFullpage(false);
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

        acc.isAction = acc.author._id == action.userId;

        if (!acc) return listUserComments;

        acc.action = action;
        if (action.kind == "ghim" && account._id == action.userId) {
          setIsOpenGhim(true);
        }
        if (action.kind == "edit") {
          acc.comment = action.newComment;
          acc.updatedAt = new Date().toISOString();
        }
        if (acc.type == "link" && action.kind == "delete") {
          if (acc.isAction) {
            acc.type = "text";
          } else if (account._id == action.userId) {
            acc.type = "text";
          } else if (account._id != action.userId) {
            acc.type = "link";
          }
        }
        if (acc.type == "image" && action.kind == "delete") {
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

        return [...listUserComments];
      });
    });
  }, [account._id]);

  const handleactiveOptions = (
    idComment: string | undefined,
    type: string,
    typeChatting: string
  ) => {
    if (type == "viewitem") {
      setIsOpenGhim(false);
      return;
    }
    const data: any = {
      id: idComment,
      userId: account._id,
      type,
      typeChatting,
    };
    socket.emit(`client-send-chatting-change`, data);
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

  const handleSendMessage = async (
    inputElement: HTMLTextAreaElement | any[] | any,
    type: string
  ) => {
    let listImage: IImageFireBase[] = [];
    let comment: string = HandleCoverStringEntries(inputElement.value.trim());

    if (type == "image") {
      listImage = inputElement;
      if (listImage.length <= 0) {
        ToastNotify("Gửi ảnh không thành công!").info();
        return;
      }
      comment = "gửi ảnh";
    } else if (type == "text") {
      if (!inputElement.value) {
        return;
      }
      const isChecked = containsLink(inputElement.value.trim());
      type = isChecked ? "link" : "text";
      if (isChecked) {
        comment = await crawLinkChating(inputElement.value.trim());
      }
    }

    const data: ChatUserPersonItemProps = {
      idAccount: account._id,
      isSee: person.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type,
      author: {
        _id: account._id,
        avatar: account.avatar,
        fullname: account.fullname,
      },
      comment,
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
  };
  const boxChatContentRef = useRef<HTMLElement>(null);
  // modal ghim tin nhắn
  const [isOpenGhim, setIsOpenGhim] = useState<boolean>(false);
  const listGhimComment =
    listUserComments.filter((comment) => comment.action.kind == "ghim") || [];
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
      {/* ghim con tainer */}
      {isOpenGhim && (
        <ModalProviderOverlay setIsCloseModal={() => setIsOpenGhim(false)}>
          <GhimContainer
            listCooment={listGhimComment}
            isOpenGhim={isOpenGhim}
            setIsOpenGhim={setIsOpenGhim}
            handleactiveOptions={handleactiveOptions}
          />
        </ModalProviderOverlay>
      )}
      <section
        ref={boxChatContentRef}
        className="chatting px-2 absolute top-0 left-0 right-0 bottom-24 pb-4 overflow-y-auto overflow-x-hidden w-full pt-24"
      >
        {listUserComments.length > 0 &&
          listUserComments.map((comment) => (
            <ChatUserPersonItem
              key={comment._id}
              {...comment}
              handleactiveOptions={handleactiveOptions}
              setIsOpenGhim={setIsOpenGhim}
            />
          ))}
      </section>

      <ChatInputPerSon
        loading={isLoading}
        setIsOpenGhim={setIsOpenGhim}
        handleSendMessage={handleSendMessage}
        className={!isOpenChat ? "open_toggle-mobile" : "hidden_toggle-mobile"}
      />
      {loadingFullPage && <LoadingContainer />}
    </div>
  );
};

export default ChatPerSonContainer;

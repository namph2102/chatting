import { FC, useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  PserSonChating,
  updatePersonStatus,
} from "../../redux/Slice/ChatPersonSlice";
import ChatHeader from "../chatContainer/ChatHeader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import {
  CapitalizeString,
  ScroolToBottom,
  ToastNotify,
  cn,
} from "../../servies/utils";
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
import SidebarAboutLayout from "./component/SidebarAboutLayout";
import { TlistGroupsMap } from "../../redux/Slice/slice.type";
import ShowImage from "./slideShowImage";
import {
  updateOpenGroup,
  updateSettingVideoCall,
} from "../../redux/Slice/AccountSlice";
import SidebarAddMember from "./component/SidebarAddMember";
import SidebarChangeInfoGroup from "./component/SidebarChangeInfoGroup";
import { ModalStatus } from "../Ui";
import { StoreComment } from "../AppInfomation/AppInfomation";
const domainSever = import.meta.env.VITE_DOMAIN_SEVER;
export const socket = io(domainSever, { transports: ["websocket"] });
export interface IFromSetting {
  formadd: boolean;
  formChangename: boolean;
  leaveRoom: boolean;
  clickUserLeaveRoom: boolean;
}
interface ChatPerSonContainerProps {
  person: PserSonChating;
}
const idRoomCurrent: { idRoom: any } = {
  idRoom: "",
};

const ChatPerSonContainer: FC<ChatPerSonContainerProps> = ({ person }) => {
  const [listUserComments, setListUserComments] = useState<
    ChatUserPersonItemProps[]
  >(StoreComment.getFollowRoom(person.idRoom) || []);

  idRoomCurrent.idRoom = person.idRoom || "";

  const { theme, account, isOpenChat, isOpenGroup } =
    useSelector((state: RootState) => state.userStore) || {};
  const [isLoading, setIsLoading] = useState(false);
  const [loadingFullPage, setLoadingFullpage] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const idRoom = person.idRoom;
    if (idRoom && !StoreComment.checkCommentInRoom(idRoom)) {
      setLoadingFullpage(true);
    }

    socket.emit("tao-room", idRoom);
    let idtimeout: any;
    if (!person._id) return;
    if (person.typechat == "friend") {
      // lắng nghe user chat off hay on
      socket.on(`friend-chattings-${person._id}`, (status) => {
        dispatch(
          updatePersonStatus({
            status: status,
            updatedAt: new Date().toISOString(),
          })
        );
      });
    }

    handleRoomChat(person.idRoom || "", account._id, person._id)
      .then((res) => {
        if (res.status == 200) {
          const infoRoom = res.data;
          if (person.typechat == "friend") {
            dispatch(
              updatePersonStatus({
                status: person.status,
                updatedAt: person.updatedAt,
              })
            );
          }

          const listNewChatting: ChatUserPersonItemProps[] =
            infoRoom.listChatting.map((acc: any) => {
              acc.isUser = account._id == acc.author._id;
              acc.isAction = acc.action.userId == acc.author._id;
              acc.idAccount = account._id;
              if (acc.file?.length > 0 && acc.action.kind == "delete") {
                if (acc.author._id != account._id && acc.action.userId) {
                  acc.type = "text";
                }
              }
              return acc;
            }) || [];

          if (listNewChatting?.length >= 0) {
            if (person.idRoom) {
              // Đang fixed
              if (!StoreComment.checkCommentInRoom(person.idRoom)) {
                StoreComment.addListCommentFollowRoom(
                  person.idRoom,
                  listNewChatting
                );
              }
              setListUserComments([...listNewChatting]);
            }

            idtimeout = setTimeout(() => {
              if (boxChatContentRef.current) {
                boxChatContentRef.current.scrollTop =
                  boxChatContentRef.current.scrollHeight;
                clearTimeout(idtimeout);
              }
            }, 500);
          }
        }
      })
      .finally(() => {
        setLoadingFullpage(false);
      });

    return () => {
      socket.emit("leaver-room-chat-current", idRoom);
      handleCloseGroup();
      clearTimeout(idtimeout);
      setListUserComments([]);
    };
  }, [account._id, person.idRoom, person.fullname]);

  const handleCloseGroup = () => {
    dispatch(updateOpenGroup(false));
  };
  // lắng nghe và sẽ thực hiện thao tác thêm sữa xóa ************************
  useEffect(() => {
    if (!account._id) return;
    socket.on("server-send-chatting-change", ({ action, idComment }) => {
      setListUserComments((listUserComments: ChatUserPersonItemProps[]) => {
        const acc: any = listUserComments.find((chat) => chat._id == idComment);
        acc.updatedAt = new Date().toISOString();
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
        if (
          (acc.type == "link" ||
            acc.type == "audio" ||
            acc.type == "document" ||
            acc.type == "location") &&
          action.kind == "delete"
        ) {
          if (acc.isAction) {
            acc.type = "text";
          } else if (account._id == action.userId) {
            acc.type = "text";
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
        person.idRoom &&
          StoreComment.updateAllComment(person.idRoom, listUserComments);
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

      StoreComment.addComment(idRoomCurrent.idRoom, data);
      setListUserComments((pre) => [...pre, data]);
      handleScrool();
      setIsLoading(false);
    });
    socket.on("user-chat-message", (data) => {
      setListUserComments((prev) => [...prev, data]);
      console.log("idRoomCurrent.idRoom", idRoomCurrent.idRoom);
      StoreComment.addComment(idRoomCurrent.idRoom, data);
      handleScrool();
      setIsLoading(false);
      if (data.isSee) {
        if (person.status) return;

        socket.on("person-friend-online", () => {
          dispatch(
            updatePersonStatus({
              status: data.isSee,
              timeOff: new Date().toISOString(),
            })
          );
        });
      }
    });
  }, []);

  const handleSendMessage = async (
    inputElement: HTMLTextAreaElement | any[] | any | Blob,
    type: string
  ) => {
    let listImage: IImageFireBase[] = [];
    let comment = "";

    if (type == "image") {
      listImage = inputElement;
      if (listImage.length <= 0) {
        ToastNotify("Gửi ảnh không thành công!").info();
        return;
      }

      comment = `<span class="text-red-400">Bạn đã xóa nội dung này</span>`;
    } else if (type == "text") {
      if (!inputElement.value) {
        return;
      }
      comment = HandleCoverStringEntries(inputElement.value.trim());
      const isChecked = containsLink(inputElement.value.trim());
      type = isChecked ? "link" : "text";
      if (isChecked) {
        const commentLink = await crawLinkChating(inputElement.value.trim());
        if (comment == commentLink) {
          type = "text";
        } else {
          type == "link";
        }
        comment = commentLink;
      }
    } else if (type == "audio") {
      // gửi base64 lên sever inputElement dang blob
      comment = inputElement;
    } else if (type == "document") {
      // gửi base64 lên sever inputElement dang blob
      comment = inputElement.path;
      listImage = [inputElement];
    } else {
      //inputElement dạng text
      comment = inputElement;
    }

    const data: ChatUserPersonItemProps = {
      idAccount: account._id,
      isSee: person?.status || false,
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
      typeChating: person.typechat,
      type,
      file: listImage,
    });
    setIsLoading(true);
  };
  const boxChatContentRef = useRef<HTMLElement>(null);
  // modal ghim tin nhắn
  const [isOpenGhim, setIsOpenGhim] = useState<boolean>(false);

  const { listGhimComment, listSidebarcomment } = listUserComments.reduce(
    (
      acc: {
        listGhimComment: ChatUserPersonItemProps[];
        listSidebarcomment: TlistGroupsMap<ChatUserPersonItemProps[]>;
      },
      com: ChatUserPersonItemProps
    ) => {
      if (com.action.kind == "ghim") {
        acc.listGhimComment.push(com);
      }
      if (com.type != "text") {
        if (acc.listSidebarcomment[com.type]) {
          acc.listSidebarcomment[com.type].unshift(com);
        } else {
          acc.listSidebarcomment[com.type] = [com];
        }
        acc.listSidebarcomment[com.type];
      }
      return acc;
    },
    { listGhimComment: [], listSidebarcomment: {} }
  );
  const [isOpenShowImage, setIsOpenShowImage] = useState(false);
  const [isOpenFromSetting, setIsOpenFromSetting] = useState<IFromSetting>({
    formadd: false,
    formChangename: false,
    leaveRoom: false,
    clickUserLeaveRoom: false,
  });
  const [messageLeavelRoom, setMessageLeavelRoom] = useState<{
    message: string;
    id: string;
    fullname: string;
  }>({ message: "Bạn muốn lời khỏi phòng?", id: "", fullname: "" });
  const handleLeaveRoom = (isLeave: boolean) => {
    if (isLeave) {
      const idLeaveRoom = messageLeavelRoom.id
        ? messageLeavelRoom.id
        : account._id;
      socket.emit("user-leave-in-group", {
        roomid: person.idRoom,
        idAccount: idLeaveRoom,
        message:
          idLeaveRoom == account._id
            ? " đã rời khỏi phòng"
            : ` bị ${CapitalizeString(account.fullname)} kích ra khỏi phòng`,
      });
    }
    setIsOpenFromSetting((prev) => ({ ...prev, leaveRoom: false }));
    messageLeavelRoom.id &&
      setMessageLeavelRoom(() => ({
        fullname: "",
        id: "",
        message: "Bạn muốn lời khỏi phòng?",
      }));
    handleCloseGroup();
  };
  const handleClickLeaveRoom = (idAccount: string, fullname: string) => {
    setMessageLeavelRoom(() => ({
      id: idAccount,
      fullname: fullname,
      message: `Bạn muốn kích ${CapitalizeString(fullname)} ra khỏi phòng?`,
    }));
    setIsOpenFromSetting((prev) => ({ ...prev, leaveRoom: true }));
  };
  const handleCallvideo = (item: {
    roomName: string;
    isOpen: boolean;
    roomId: string;
    type: string;
  }) => {
    dispatch(updateSettingVideoCall({ ...item, join: true }));
  };
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
            idBGcolor={theme.darkmode}
            isOpenGhim={isOpenGhim}
            setIsOpenGhim={setIsOpenGhim}
            handleactiveOptions={handleactiveOptions}
          />
        </ModalProviderOverlay>
      )}
      <section
        ref={boxChatContentRef}
        // absolute top-0 left-0  bottom-24 pt-24
        className="chatting px-2 pb-4 overflow-y-auto h-[calc(100vh-160px)] overflow-x-hidden w-full "
      >
        {listUserComments.length > 0 &&
          listUserComments.map((comment) => (
            <ChatUserPersonItem
              key={comment._id}
              {...comment}
              typechat={person.typechat}
              handleactiveOptions={handleactiveOptions}
              setIsOpenGhim={setIsOpenGhim}
              callbackCallvideo={handleCallvideo}
            />
          ))}
      </section>
      <ChatInputPerSon
        loading={isLoading}
        setIsOpenGhim={setIsOpenGhim}
        handleSendMessage={handleSendMessage}
        className={!isOpenChat ? "open_toggle-mobile" : "hidden_toggle-mobile"}
      />
      {/* thông tin về box chat */}
      <div
        id={theme.darkmode}
        className={cn(
          "fixed top-0 right-0  duration-300 ease-in bottom-0 md:w-[320px] w-full z-50",
          isOpenGroup ? "" : "translate-x-[200%]"
        )}
      >
        <SidebarAboutLayout
          person={person}
          listSidebarcomment={listSidebarcomment}
          handleCloseGroup={handleCloseGroup}
          setIsOpenShowImage={setIsOpenShowImage}
          setIsOpenFromSetting={setIsOpenFromSetting}
          callBackStatus={handleClickLeaveRoom}
        />
      </div>
      {listSidebarcomment["image"] && isOpenShowImage && (
        <ShowImage
          setIsOpenShowImage={setIsOpenShowImage}
          fullname={person.fullname}
          listSidebarcomment={listSidebarcomment["image"]}
        />
      )}
      {loadingFullPage && <LoadingContainer />}
      {person.typechat == "group" &&
        isOpenFromSetting.formadd &&
        account._id &&
        account.friends.length > 0 && (
          <SidebarAddMember
            setIsOpenFromSetting={setIsOpenFromSetting}
            accountID={account._id}
            accountFullname={account.fullname}
            person={person}
            theme={theme}
          />
        )}
      {person.typechat == "group" && isOpenFromSetting.formChangename && (
        <SidebarChangeInfoGroup
          theme={theme}
          person={person}
          idAccount={account._id}
          setIsOpenFromSetting={setIsOpenFromSetting}
        />
      )}
      {person.typechat == "group" && isOpenFromSetting.leaveRoom && (
        <ModalStatus
          callBackStatus={handleLeaveRoom}
          title={messageLeavelRoom.message}
        />
      )}
    </div>
  );
};

export default ChatPerSonContainer;

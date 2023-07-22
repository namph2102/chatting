import { FC } from "react";
import { INoticeItem } from "./Notice";

import { socket } from "../../components/ChatPerSonContainer/ChatPerSonContainer";
import { CapitalizeString, HandleTimeDiff } from "../../servies/utils";

interface INoticeItemProps extends INoticeItem {
  handleUpdateStatus: (isNotice: string, isAccept: boolean) => void;
}
const NoticeItem: FC<INoticeItemProps> = ({
  status,
  type,
  userSend,
  userAccept,
  _id,
  accountID,
  isAccepted,

  updatedAt,
  isSended,
  idRoomInvited,
  message,
  handleUpdateStatus,
}) => {
  const handleAddFriend = (isAccept: boolean) => {
    if (type == 4) {
      socket.emit("user-accpet-join-group", {
        idNotice: _id,
        idRoom: idRoomInvited,
        status: isAccept,
        userSendID: accountID,
      });
    } else if (type == 1) {
      socket.emit("send-info-add-friend", {
        isAccept,
        idInfo: _id,
        fullname: userSend.fullname,
        fullnameAccept: userAccept.fullname,
        idUserSend: userSend._id,
        idUserAccept: userAccept._id,
      });
    }
    handleUpdateStatus(_id, isAccept);
  };

  if (type == 1) {
    message = isSended
      ? `Bạn đã gửi lời mời kết bạn đến  ${CapitalizeString(
          userAccept.fullname,
          true
        )}`
      : `  ${CapitalizeString(
          userSend.fullname,
          true
        )}  đã gửi lời mời kết bạn`;
  } else if (type == 2) {
    message = `${isAccepted ? "Bạn" : CapitalizeString(userAccept.fullname)}  ${
      status ? " đã đồng ý kết bạn " : " đã từ chối kết bạn "
    } ${isAccepted ? CapitalizeString(userSend.fullname) : ""}`;
  }
  let avatashow = userAccept.avatar;
  if (type == 1) {
    avatashow = userSend.avatar;
  } else if (type == 2) {
    if (isAccepted) {
      avatashow = userAccept.avatar;
    }
  } else if (type == 3) {
    avatashow = userSend.avatar;
  } else if (type == 4) {
    message = `${
      isSended
        ? `Bạn đã mời ${CapitalizeString(
            userAccept.fullname
          )} tham gia phòng chat`
        : `${CapitalizeString(
            userSend.fullname
          )} đã mời bạn tham gia phòng chat`
    }`;
    avatashow = isSended ? userSend.avatar : userSend.avatar;
  } else if (type == 5) {
    message = `${isAccepted ? "Bạn" : CapitalizeString(userAccept.fullname)} ${
      status ? `đồng ý tham gia nhóm chat` : "từ chối tham gia nhóm chat"
    }`;
  } else if (type == 6) {
    avatashow = userSend.avatar;
    message = `${
      isSended ? "Bạn " : ` ${CapitalizeString(userSend.fullname)} `
    } ${message}`;
  } else if (type == 7) {
    avatashow = isSended ? userSend.avatar : userAccept.avatar;
    message = `${isSended ? "Bạn" : CapitalizeString(userAccept.fullname)} ${
      status
        ? `đã gọi cho ${CapitalizeString(userAccept.fullname)}`
        : "đã gọi cho bạn"
    }`;
  }

  return (
    <li className="mb-2">
      <div className="flex gap-2 items-center">
        <img
          width={40}
          height={40}
          className="object-cover rounded-full w-10 h-10"
          src={avatashow}
          alt="lỗi ảnh"
        />
        <div>
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: message }}
          />
          <time className="text-xs text-primary">
            {HandleTimeDiff(updatedAt)}
          </time>
        </div>
      </div>
      {(type == 1 || type == 4) && !isSended && !status && (
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            onClick={() => handleAddFriend(true)}
            className="px-3 py-2 hover:opacity-70 background-primary text-white text-sm rounded-2xl min-w-[100px]"
          >
            Xác nhận
          </button>
          <button
            onClick={() => handleAddFriend(false)}
            className="px-3 py-2 drop_menu-hover border-[1px] border-[#c0bfbf] text-sm rounded-2xl min-w-[100px]"
          >
            Từ chối
          </button>
        </div>
      )}
    </li>
  );
};

export default NoticeItem;

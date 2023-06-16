import { FC } from "react";
import { INoticeItem } from "./Notice";

import { socket } from "../../components/ChatPerSonContainer/ChatPerSonContainer";
import { HandleTimeDiff } from "../../servies/utils";
interface INoticeItemProps extends INoticeItem {
  setIsShowAddfriend: (isShow: boolean) => void;
}
const NoticeItem: FC<INoticeItemProps> = ({
  _id,
  status,
  createdAt,
  type,
  fullname,
  userSend,
  setIsShowAddfriend,
}) => {
  const handleAddFriend = (isAccept: boolean) => {
    socket.emit("send-info-add-friend", {
      isAccept,
      idInfo: _id,
      fullname: userSend.fullname,
      fullnameAccept: fullname,
      idUserSend: userSend._id,
    });
    setIsShowAddfriend(false);
  };
  let message = " đã gửi lời mời kết bạn ";
  if (type == 2) {
    message = status ? " đã đồng ý kết bạn " : " đã từ chối kết bạn ";
  }
  return (
    <li className="mb-2">
      <div className="flex gap-2 items-center">
        <img
          width={40}
          height={40}
          className="object-cover rounded-full"
          src={userSend.avatar}
          alt=""
        />
        <div>
          <p className="text-sm">
            <span className="font-bold capitalize ">{userSend.fullname}</span>
            {message}
          </p>
          <time className="text-xs text-primary">
            {HandleTimeDiff(createdAt)}
          </time>
        </div>
      </div>
      {type == 1 && (
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
            Xóa
          </button>
        </div>
      )}
    </li>
  );
};

export default NoticeItem;

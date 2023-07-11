import { FC } from "react";
import { ICallHistory } from "./callHistory";
import moment from "moment";
import { CapitalizeString } from "../../servies/utils";
import { BiVideo } from "react-icons/bi";

const CallHistoryItem: FC<{ item: ICallHistory; idAccount: string }> = ({
  item,
  idAccount,
}) => {
  let message = "";

  const isAccount = idAccount == item.author._id;
  if (item.room.type == "friend") {
    if (isAccount) {
      message = `Bạn đã gọi điện`;
    } else {
      message = `${CapitalizeString(item.author.fullname)} đã gọi điện cho bạn`;
    }
  } else {
    if (isAccount) {
      message = `Bạn tạo phòng họp mặt trong nhóm ${CapitalizeString(
        item.room.name
      )} `;
    } else {
      message = `${CapitalizeString(
        item.author.fullname
      )} đã tạo phòng họp mặt trong nhóm ${CapitalizeString(item.room.name)} `;
    }
  }

  return (
    <div key={item._id} className="flex justify-between items-center mb-2">
      <div className="flex gap-2 items-center">
        <img
          src={item.author.avatar}
          className="w-10 h-10 object-cover"
          alt=""
        />
        <div>
          <p className="font-light text-xs">{message}</p>
          <p className="font-light text-xs">
            {moment(item.updatedAt).format("HH:mm:ss DD/MM/YYYY")}
          </p>
        </div>
      </div>
      <p className="text-xl text-primary">
        <BiVideo />
      </p>
    </div>
  );
};

export default CallHistoryItem;

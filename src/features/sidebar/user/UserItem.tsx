import { FC } from "react";

import { IUserItem } from "./user.type";
import { cn } from "../../../servies/utils";
import { setIsOpenDisplayTable } from "../../../redux/Slice/AccountSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux";
import { updatePerson } from "../../../redux/Slice/ChatPersonSlice";

const UserItem: FC<{ user: IUserItem }> = ({ user }) => {
  const dispatchRedux: AppDispatch = useDispatch();
  const handleChatWithFriend = (e: any) => {
    e.stopPropagation();

    dispatchRedux(updatePerson(user));
    dispatchRedux(setIsOpenDisplayTable(true));
  };

  return (
    <div
      onClick={handleChatWithFriend}
      className="flex justify-between mb-2 items-center cursor-pointer"
      title={`${user.fullname}`}
    >
      <div className="flex gap-5 items-center">
        <div className="relative ">
          <img
            src={user.avatar}
            alt={user.avatar}
            height={30}
            width={30}
            className="rounded-full object-cover"
            loading="lazy"
          />
          <div
            className={cn(
              "absolute bottom-0 left-7  w-2.5 h-2.5 border-[#888585] border-[1px]  rounded-full",
              user.status ? " bg-status-online" : "bg-status-offline"
            )}
          ></div>
        </div>
        <p className="lg:max-w-[200px]  sm:max-w-full    whitespace-nowrap overflow-hidden  capitalize  text-[14px]  font-medium  text-ellipsis">
          {user.fullname}
        </p>
      </div>
      {user.contentWatting && (
        <span className="inline-block py-0.5 badge-soft-dark bg-shadow-inner px-1 text-sm">
          {user.contentWatting}
        </span>
      )}
    </div>
  );
};

export default UserItem;

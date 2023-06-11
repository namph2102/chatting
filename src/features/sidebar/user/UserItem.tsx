import { FC } from "react";

import { IUserItem } from "./user.type";
import { cn } from "../../../servies/utils";
import { setIsOpenDisplayTable } from "../../../redux/Slice/AccountSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux";

const UserItem: FC<{ user: IUserItem }> = ({ user }) => {
  const dispatchRedux: AppDispatch = useDispatch();

  return (
    <div
      onClick={() =>
        window.innerWidth <= 1024 && dispatchRedux(setIsOpenDisplayTable(true))
      }
      className="flex justify-between mb-2 items-center cursor-pointer"
      title={`${user.fullname}`}
    >
      <div className="flex gap-5 items-center">
        <div className="relative ">
          <img
            src={user.avata}
            alt={user.avata}
            height={30}
            width={30}
            className="rounded-full object-cover"
            loading="lazy"
          />
          <div
            className={cn(
              "absolute bottom-0 left-7  w-2.5 h-2.5 border-[#888585] border-[1px]  rounded-full",
              user.active ? " bg-status-online" : "hidden"
            )}
          ></div>
        </div>
        <p className="lg:max-w-[200px]  sm:max-w-full   whitespace-nowrap overflow-hidden  capitalize  text-xs  font-medium  text-ellipsis">
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

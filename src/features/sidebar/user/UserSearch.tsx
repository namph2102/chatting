import React, { FC, Suspense, useRef } from "react";
import { BsX } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { Skeleton } from "@mui/material";
import { ToastNotify, historyChatting } from "../../../servies/utils";
export interface UserSearchProps {
  _id: string;
  avatar: string;
  title: string;
  des: string;
  isShowimage?: boolean;
}
// eslint-disable-next-line react-refresh/only-export-components
const UserSearch: FC<UserSearchProps> = ({
  _id,
  title,
  des,
  avatar = "/images/avata.jpg",
  isShowimage,
}) => {
  const boxElement = useRef<HTMLElement>(null);
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isShowimage) ToastNotify("Xóa thành công !").success();
    const listChattingLocal = historyChatting("searchHistory");
    listChattingLocal.delete(_id);
    if (boxElement.current) {
      boxElement.current?.classList.toggle("hidden");
    }
  };
  return (
    <article
      ref={boxElement}
      className="item_list-search flex items-center justify-between hover:bg-main/20 py-3 px-1 cursor-pointer"
    >
      <div className="flex gap-2 items-center">
        {isShowimage ? (
          <Suspense
            fallback={<Skeleton variant="circular" width={40} height={40} />}
          >
            <img
              src={avatar}
              className="rounded-full object-cover"
              width="40"
              height="40"
              alt="Avata search"
              loading="lazy"
            />
          </Suspense>
        ) : (
          <button
            type="button"
            className="py-2 px-2 bg-aside-600 hover:bg-main/20 btn_search--bg rounded-full text-center"
          >
            <BiSearch />
          </button>
        )}

        <div className="text-sm">
          <p className="font-medium capitalize">{title}</p>
          <p className="text-xs mt-1 capitalize">{des}</p>
        </div>
      </div>
      <button
        onClick={handleDelete}
        className="hover:bg-white/20 py-1 px-1 rounded-full"
      >
        <BsX className="text-lg" />
      </button>
    </article>
  );
};

export default React.memo(UserSearch);

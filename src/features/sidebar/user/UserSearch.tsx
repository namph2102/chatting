import React, { FC, Suspense, useRef } from "react";
import { BsX } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { Skeleton } from "@mui/material";
import { historyChatting } from "../../../servies/utils";
import { useNavigate } from "react-router-dom";
export interface IUserSearch {
  _id: string;
  avatar: string;
  fullname: string;
  status: boolean;
  relationship: boolean;
  idRoom: string;
}
interface UserSearchProps {
  _id: string;
  avatar: string;
  status: boolean;
  fullname: string;
  relationship: boolean;
  idRoom: string;
  callback: (id: string, idRoom: string) => void;
}

const UserSearch: FC<UserSearchProps> = ({
  _id,
  fullname,
  relationship,
  avatar = "/images/avata.jpg",
  idRoom,
  callback,
}) => {
  const navigate = useNavigate();
  const boxElement = useRef<HTMLElement>(null);
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const listChattingLocal = historyChatting("searchHistory");
    listChattingLocal.delete(_id);
    if (boxElement.current) {
      boxElement.current?.classList.toggle("hidden");
    }
  };
  const handleGetLayoutChatting = (_id: string, idRoom: string) => {
    if (relationship) {
      callback(_id, idRoom);
    } else {
      navigate("/tim-kiem?q=" + fullname);
      callback(_id, "");
    }
  };

  return (
    <article
      onClick={() => handleGetLayoutChatting(_id, idRoom)}
      ref={boxElement}
      className="item_list-search flex items-center justify-between hover:bg-main/20 py-3 px-1 cursor-pointer"
    >
      <div className="flex gap-2 items-center">
        {relationship ? (
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
          <p className="font-medium capitalize">{fullname}</p>
          <p className="text-xs mt-1 capitalize">{relationship && "bạn bè"}</p>
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

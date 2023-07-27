import React, { useEffect, useState } from "react";
import { BiChevronLeft, BiSearchAlt } from "react-icons/bi";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";

import { nanoid } from "@reduxjs/toolkit";
import { handleAddFriendSocket } from "../../../servies/sockets";
import { typeMapItem } from "../../../redux/Slice/slice.type";
import { useQuery } from "react-query";
import instance from "../../../config";
import { cn } from "../../../servies/utils";
import { useTranslation } from "react-i18next";
import "../../../servies/translate/contfigTranslate";
interface SidebarListMemberProps {
  listMemberGroup: typeMapItem;
  setOpenListMember: (isOpenlistMember: boolean) => void;
  isOpenListMember: boolean;
  callBackStatus: (idAccount: string, fullname: string) => void;
}
const SidebarListMember: React.FC<SidebarListMemberProps> = ({
  listMemberGroup,
  setOpenListMember,
  isOpenListMember,
  callBackStatus,
}) => {
  const { t } = useTranslation();
  const { theme, account } = useSelector((state: RootState) => state.userStore);
  const { data } = useQuery({
    queryKey: [
      "list infomation with type 1",
      account._id,
      account.friends.length,
    ],
    queryFn: async () => {
      const res = await instance.post("info/accept/friends", {
        idUser: account._id,
      });
      return await res.data.listInfo;
    },
  });
  let listUserWatingAcceptFriends: string[] = [];
  if (data && data.length > 0) {
    listUserWatingAcceptFriends = data?.map((item: any) => item.userAccept);
  }

  const [search, setSearch] = useState<string>("");
  const listUserShowSearch = search
    ? listMemberGroup.listUser.filter((user) =>
        user.fullname.trim().includes(search)
      )
    : (listMemberGroup?.listUser &&
        listMemberGroup.listUser?.length > 0 &&
        listMemberGroup.listUser) ||
      [];
  useEffect(() => {
    setSearch("");
  }, []);

  return (
    <section
      id={theme.darkmode}
      className={cn(
        "absolute inset-0 px-4 border-l-gray-400 border-[1px]",
        isOpenListMember ? "scale-100" : "scale-0"
      )}
    >
      <button
        onClick={() => setOpenListMember(false)}
        className="p-2 hover:bg-gray-500 absolute top-1 left-2 text-3xl rounded-full"
      >
        <BiChevronLeft />
      </button>
      <h6 className="text-center py-4 text-base md:text-xl capitalize">
        {t("listMember")}
      </h6>

      <p className="text-sm my-2">
        {t("listMember")} ({listMemberGroup?.listUser?.length || 0})
      </p>
      <div className="px-2 flex gap-1 form-control items-center">
        <span className="text-2xl">
          {" "}
          <BiSearchAlt />
        </span>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="py-1 w-full  px-2 border-none bg-transparent outline-none "
        />
      </div>
      <section className="mt-4 max-h-[calc(100vh-140px)] flex flex-col gap-2 overflow-y-auto">
        {listUserShowSearch.length > 0 &&
          listUserShowSearch.map((friend) => (
            <article
              key={nanoid()}
              className="flex gap-2 justify-between items-center px-1 cursor-pointer "
            >
              <div className="flex gap-2 items-center ">
                <img
                  src={friend.avatar}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="ảnh lỗi"
                />
                <p className="font-semibold text-sm capitalize flex flex-wrap flex-col ">
                  <span className="text-primary-hover line-clamp-2 md:max-w-[120px]">
                    {friend.fullname}
                  </span>
                  {friend._id == listMemberGroup.role._id && (
                    <span className="text-[10px] font-normal">
                      {t("boss")} {t("group")}
                    </span>
                  )}
                </p>
              </div>
              {account._id != friend._id &&
                !account.friends.includes(`${friend._id}`) &&
                !listUserWatingAcceptFriends.includes(`${friend._id}`) && (
                  <button
                    onClick={() => {
                      listUserWatingAcceptFriends.push(friend._id);
                      handleAddFriendSocket({
                        fullname: account.fullname,
                        userAccept: friend._id,
                        userSend: account._id,
                      });
                    }}
                    className="text-primary-hover border-2 border-gray-700 drop_menu-hover py-2 px-4 rounded-2xl text-xs"
                  >
                    {t("makeFriend")}
                  </button>
                )}
              {listMemberGroup.typechat == "group" &&
                friend._id != account._id &&
                account._id == listMemberGroup.role._id && (
                  <button
                    onClick={() => callBackStatus(friend._id, friend.fullname)}
                    className="text-primary-hover  border-red-500 drop_menu-hover rounded-2xl text-xs"
                  >
                    {t("kick")}
                  </button>
                )}
            </article>
          ))}
      </section>
    </section>
  );
};
// listMemberGroup?.role?._id == accountId
export default SidebarListMember;

import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux";
import { updatePerson } from "../../../redux/Slice/ChatPersonSlice";
import { useNavigate } from "react-router-dom";
import { setIsOpenDisplayTable } from "../../../redux/Slice/AccountSlice";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarGroup } from "@mui/material";
import { nanoid } from "@reduxjs/toolkit";
import ToltipProvider from "../../../components/webmedia/component/ToltipProvider";
import { CapitalizeString } from "../../../servies/utils";

("../../../servies/translate/contfigTranslate");
export interface IUserSearchPageItem {
  avatar: string;
  fullname: string;
  follows: number;
  totalFriends: number;
  relationship: boolean;
  idRoom: string;
  isWating: boolean;
  friends: {
    _id: string;
    avatar: string;
    fullname: string;
  }[];
  _id: string;
  idAccount: string;
  handleAddFriends: (id: string) => void;
}
const UserSearchPageItem: FC<IUserSearchPageItem> = ({
  avatar,
  follows,
  fullname,
  totalFriends,
  relationship,
  idRoom,
  isWating,
  friends,
  _id,
  idAccount,
  handleAddFriends,
}) => {
  const { t } = useTranslation();
  const navigator = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [_, setIsSetAddFriend] = useState<boolean>(true);
  const handleaddFriendElement = (e: any) => {
    if (relationship) {
      dispatch(
        updatePerson({ _id, avatar: avatar, fullname: fullname, idRoom })
      );
      dispatch(setIsOpenDisplayTable(true));
      navigator("/nhan-tin");
      return;
    }
    if (e.target) {
      e.target.textContent = t("waitingAccept");

      setIsSetAddFriend((prev) => {
        if (prev) {
          handleAddFriends(_id);
        }
        return false;
      });
    }
  };
  let totalRender = 0;
  return (
    <article className="flex justify-between bg-follow-darkmode p-2 rounded-lg items-center">
      <div className="flex gap-2 items-center">
        <img
          src={avatar}
          width={60}
          height={60}
          loading="lazy"
          className="rounded-full"
          alt={fullname}
        />
        <div>
          <h3 className="sm:text-base text-sm font-medium capitalize">
            {fullname}
          </h3>
          <p className="text-xs font-light">
            {follows} {t("follower")}
          </p>
          <div className="flex gap-2 text-sm items-center mt-1">
            {totalFriends > 0 && friends?.length > 0 && (
              <AvatarGroup max={friends.length}>
                {friends.map((friend) => {
                  if (totalRender > 5 || friend._id == idAccount) {
                    return <span className="hidden" key={nanoid()}></span>;
                  }

                  totalRender++;
                  return (
                    <ToltipProvider
                      key={nanoid()}
                      title={CapitalizeString(friend.fullname)}
                    >
                      <span className="cursor-pointer">
                        <Avatar
                          sx={{
                            width: 16,
                            height: 16,
                            borderColor: "currentcolor",
                          }}
                          alt={friend.fullname}
                          src={friend.avatar}
                        />
                      </span>
                    </ToltipProvider>
                  );
                })}
              </AvatarGroup>
            )}
            {totalFriends} {t("roommate")}
          </div>
        </div>
      </div>
      <span
        onClick={(e) => {
          handleaddFriendElement(e);
        }}
        className="py-2 px-4 text-xs border-[1px] border-[#dfe2e2] background-primary-hover ease-in duration-200  cursor-pointer rounded-full "
      >
        {isWating
          ? t("waitingAccept")
          : relationship
          ? t("addfriend")
          : t("chat")}
      </span>
    </article>
  );
};

export default UserSearchPageItem;

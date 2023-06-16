import { Avatar, AvatarGroup } from "@mui/material";
import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux";
import { updatePerson } from "../../../redux/Slice/ChatPersonSlice";
import { useNavigate } from "react-router-dom";
import { setIsOpenDisplayTable } from "../../../redux/Slice/AccountSlice";
export interface IUserSearchPageItem {
  avatar: string;
  fullname: string;
  follows: number;
  totalFriends: number;
  relationship: boolean;
  _id: string;
  handleAddFriends: (id: string) => void;
}
const UserSearchPageItem: FC<IUserSearchPageItem> = ({
  avatar,
  follows,
  fullname,
  totalFriends,
  relationship,
  _id,
  handleAddFriends,
}) => {
  const navigator = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [isSetAddFriend, setIsSetAddFriend] = useState<boolean>(true);
  const handleaddFriendElement = (e: any) => {
    if (relationship) {
      console.log(fullname, _id);
      dispatch(setIsOpenDisplayTable(true));
      dispatch(updatePerson({ _id, avatar: avatar, fullname: fullname }));
      navigator("/nhan-tin");
      return;
    }
    if (e.target) {
      e.target.textContent = "Chờ xác nhận";
      console.log(isSetAddFriend);
      setIsSetAddFriend((prev) => {
        if (prev) {
          handleAddFriends(_id);
        }
        return false;
      });
    }
  };
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
          <h3 className="text-base font-medium capitalize">{fullname}</h3>
          <p className="text-xs font-light">{follows} người theo dõi</p>
          <div className="flex gap-2 text-sm items-center mt-1">
            <AvatarGroup max={4}>
              <Avatar
                sx={{ width: 16, height: 16, borderColor: "currentcolor" }}
                alt="Remy Sharp"
                src="https://lh3.googleusercontent.com/a/AAcHTtcqN_7DUvJDclxOIMY4dCTcDFgFMaICh-4vpC5r=s96-c"
              />
              <Avatar
                sx={{ width: 16, height: 16, borderColor: "currentcolor" }}
                alt="Travis Howard"
                src="https://lh3.googleusercontent.com/a/AAcHTtcqN_7DUvJDclxOIMY4dCTcDFgFMaICh-4vpC5r=s96-c"
              />
            </AvatarGroup>
            {totalFriends} bạn chung
          </div>
        </div>
      </div>
      <span
        onClick={(e) => {
          handleaddFriendElement(e);
        }}
        className="py-2 px-4 text-xs border-[1px] border-[#dfe2e2] background-primary-hover ease-in duration-200  cursor-pointer rounded-full "
      >
        {relationship ? "Nhắn tin" : "Thêm bạn bè"}
      </span>
    </article>
  );
};

export default UserSearchPageItem;

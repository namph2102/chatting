import { FC } from "react";
import { BiBell, BiCog, BiLock, BiLogOutCircle } from "react-icons/bi";
import { ToastNotify, cn } from "../../servies/utils";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux";
import { updateNotice } from "../../redux/Slice/AccountSlice";

interface ProfileProps {
  username: string;
  fullname: string;
  isOpen: boolean;
  noticeTotal: number;
  setIsOpenProfile: (isOpen: boolean) => void;
}
const Profile: FC<ProfileProps> = ({
  username,
  fullname,
  isOpen,
  noticeTotal,
  setIsOpenProfile,
}) => {
  const navigation = useNavigate();
  const dispacth: AppDispatch = useDispatch();
  const handleLogOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    ToastNotify("Đăng xuất thành công!").success();
    navigation("/dang-nhap");
  };
  const handleRemoveInfo = () => {
    dispacth(updateNotice(0));
  };
  return (
    <div
      id="userDropdown"
      className={cn(
        "z-10 absolute   ease-in duration-100  text-white -top-[250px] lg:left-0  -left-[150px] border-gray-700 border-[1px]  bg-menu  rounded-lg shadow w-48 ",
        isOpen ? "scale-1" : "scale-0"
      )}
    >
      <div className="px-4 py-3 text-sm border-b-[1px] border-primary">
        <div className="capitalize truncate">Tên: {fullname}</div>
        <div className="font-medium truncate">Tài khoản: {username}</div>
      </div>
      <ul
        className="py-2 text-sm "
        aria-labelledby="avatarButton"
        onClick={() => setIsOpenProfile(false)}
      >
        <li onClick={handleRemoveInfo}>
          <Link
            to="/thong-bao"
            className="flex justify-between w-full  px-4 py-2 text-sm hover:bg-aside/30"
          >
            Thông Báo
            <Badge badgeContent={noticeTotal} color="primary">
              <span>
                <BiBell fontSize="1rem" />
              </span>
            </Badge>
          </Link>
        </li>
        <li>
          <Link
            to="/dang-nhap"
            className="flex justify-between  px-4 py-2 text-sm hover:bg-aside/30"
          >
            Cài đặt <BiCog fontSize="1rem" />
          </Link>
        </li>
        <li>
          <Link
            to="/dang-ky"
            className="flex justify-between  px-4 py-2 text-sm hover:bg-aside/30"
          >
            Đổi mật khẩu <BiLock fontSize="1rem" />
          </Link>
        </li>
      </ul>
      <div className="py-1 border-t-[1px] border-primary">
        <span
          onClick={handleLogOut}
          className="flex justify-between  cursor-pointer px-4 py-2 text-sm hover:bg-aside/30"
        >
          Đăng xuất <BiLogOutCircle fontSize="1rem" />
        </span>
      </div>
    </div>
  );
};

export default Profile;

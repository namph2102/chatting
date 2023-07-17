import { FC } from "react";
import { BiBell, BiCog, BiLock, BiLogOutCircle } from "react-icons/bi";
import { ToastNotify, cn } from "../../servies/utils";
import { Link } from "react-router-dom";
import { Badge } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux";
import { updateNotice } from "../../redux/Slice/AccountSlice";
import "../../components/chatContainer/component/Youtube";
import { useTranslation } from "react-i18next";
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
  const dispacth: AppDispatch = useDispatch();
  const handleLogOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    ToastNotify(`${t("logout")} ${t("success")}!`).success();
    location.reload();
  };
  const handleRemoveInfo = () => {
    dispacth(updateNotice(0));
  };
  const { t } = useTranslation();
  if (!username && !fullname) return <></>;
  return (
    <div
      id="userDropdown"
      className={cn(
        "z-10 absolute   ease-in duration-100  text-white -top-[250px] lg:left-0  -left-[150px] border-gray-700 border-[1px]  bg-menu  rounded-lg shadow w-48 ",
        isOpen ? "scale-1" : "scale-0"
      )}
    >
      <div className="px-4 py-3 text-sm border-b-[1px] border-primary">
        <div className="capitalize truncate">
          {t("name")}: {fullname}
        </div>
        <div className="font-medium truncate">
          {t("username")}: {username}
        </div>
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
            {t("notice")}
            <Badge badgeContent={noticeTotal} color="primary">
              <span>
                <BiBell fontSize="1rem" />
              </span>
            </Badge>
          </Link>
        </li>
        <li>
          <Link
            to="/cai-dat"
            className="flex justify-between  px-4 py-2 text-sm hover:bg-aside/30"
          >
            {t("settings")} <BiCog fontSize="1rem" />
          </Link>
        </li>
        <li>
          <Link
            to="/doi-mat-khau"
            className="flex justify-between  px-4 py-2 text-sm hover:bg-aside/30 capitalize"
          >
            {t("change") + " " + t("password")} <BiLock fontSize="1rem" />
          </Link>
        </li>
      </ul>
      <div className="py-1 border-t-[1px] border-primary">
        <span
          onClick={handleLogOut}
          className="flex justify-between  cursor-pointer px-4 py-2 text-sm hover:bg-aside/30"
        >
          {t("logout")} <BiLogOutCircle fontSize="1rem" />
        </span>
      </div>
    </div>
  );
};

export default Profile;

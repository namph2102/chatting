import { FC } from "react";
import { BiBell, BiCog, BiLock, BiLogOutCircle, BiTone } from "react-icons/bi";
import { ToastNotify, cn } from "../../servies/utils";
import { Link } from "react-router-dom";
import { Badge } from "@mui/material";

import "../../components/chatContainer/component/Youtube";
import { useTranslation } from "react-i18next";

interface ProfileProps {
  username: string;
  fullname: string;
  isMember: boolean;
  isOpen: boolean;
  noticeTotal: number;

  setIsOpenProfile: (isOpen: boolean) => void;
}
const Profile: FC<ProfileProps> = ({
  username,
  fullname,
  isMember,
  isOpen,
  noticeTotal,
  setIsOpenProfile,
}) => {
  const handleLogOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("searchHistory");

    ToastNotify(`${t("logout")} ${t("success")}!`).success();

    location.reload();
  };

  const { t } = useTranslation();
  if (!username && !fullname) return <></>;
  return (
    <div
      id="userDropdown"
      className={cn(
        "z-10 absolute   ease-in duration-100  text-white  lg:left-0  -left-[150px] border-gray-700 border-[1px]  bg-menu  rounded-lg shadow w-48 ",
        isOpen ? "scale-1" : "scale-0",
        isMember ? "-top-[250px]" : "-top-[290px]"
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
        <li>
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
        {!isMember && (
          <li>
            <Link
              to="https://blog.zecky.online/dashboard"
              target="_blank"
              className="flex justify-between  px-4 py-2 hover:bg-orange-800 text-sm hover:bg-aside/30 capitalize"
            >
              {t("adminPage")} <BiTone fontSize="1rem" />
            </Link>
          </li>
        )}
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

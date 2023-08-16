import React, { useEffect, useState } from "react";
import { Badge, Tooltip } from "@mui/material";

import Profile from "./Profile";
import { MenuItem } from "./MenuItem";

import { listMenu } from "./header.util";
import { cn, deFaultIconSize } from "../../servies/utils";
import { componentsProps } from "../../styles/componentsProps";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux";

import { BiSun, BiMoon } from "react-icons/bi";
import { updateTheme } from "../../redux/Slice/AccountSlice";
import "../../components/chatContainer/component/Youtube";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [isOpenProfile, setIsOpenProfile] = useState<boolean>(false);
  const { account, theme, noticeTotal } = useSelector(
    (state: RootState) => state.userStore
  );
  const dispacth: AppDispatch = useDispatch();
  const handleToggleTheme = (e: any) => {
    e.target.classList.toggle("active");
    const configTheme = { darkmode: "" };

    if (theme.darkmode == "light-mode") {
      configTheme.darkmode = "dark-mode";
    } else {
      configTheme.darkmode = "light-mode";
    }
    localStorage.setItem("darkmode", configTheme.darkmode);
    dispacth(updateTheme(configTheme));
  };
  useEffect(() => {
    document.addEventListener("click", () => {
      setIsOpenProfile(false);
    });
    return () => {
      document.removeEventListener("click", () => {
        setIsOpenProfile(false);
      });
    };
  }, []);
  const { t } = useTranslation();

  return (
    <header
      className={cn(
        "lg:w-[75px] w-full lg:h-screen bg-menu shadow lg:static fixed lg:z-10  z-20 left-0 right-0 bottom-0 h-[75px]"
      )}
    >
      <nav id="nav__menu">
        <ul className="flex lg:h-screen justify-around  lg:flex-col  h-[75px]  py-6">
          {listMenu.length > 0 &&
            listMenu.map((menu) => (
              <MenuItem
                key={menu.title}
                title={t(menu.title)}
                Icon={menu.Icon}
                path={menu.path}
                className={menu?.hiddenMoblie ? "lg:block hidden" : ""}
              />
            ))}
          <li className={cn("cursor-pointer")}>
            <span
              id="menu-sidebar_effect"
              className={cn("flex items-center  justify-center capitalize ")}
            >
              <Tooltip
                componentsProps={componentsProps}
                title={
                  <span className="capitalize">
                    {theme.darkmode.replace("-", " ")}
                  </span>
                }
                arrow
                placement="left"
                className="text-xl cursor-pointer capitalize"
              >
                <span onClick={handleToggleTheme} className="lg">
                  {theme.darkmode == "dark-mode" ? (
                    <BiMoon fontSize={deFaultIconSize} />
                  ) : (
                    <BiSun fontSize={deFaultIconSize} />
                  )}
                </span>
              </Tooltip>
            </span>
          </li>
          <li className="flex justify-center relative">
            <Tooltip
              title={isOpenProfile ? "" : t("yourprofile")}
              placement="top"
              componentsProps={componentsProps}
              arrow
            >
              <span>
                <Badge badgeContent={noticeTotal} color="primary">
                  <a className="cursor-pointer">
                    <img
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpenProfile(!isOpenProfile);
                      }}
                      src={account.avatar || "/images/avata.jpg"}
                      width="30"
                      height="30"
                      alt="Avatar"
                      className="rounded-full object-cover w-8 h-8"
                      id="avatarButton"
                      data-dropdown-toggle="userDropdown"
                      data-dropdown-placement="bottom-start"
                    />
                  </a>
                </Badge>
              </span>
            </Tooltip>

            <Profile
              isOpen={isOpenProfile}
              setIsOpenProfile={setIsOpenProfile}
              username={account.username}
              noticeTotal={noticeTotal}
              fullname={account.fullname}
              isMember={
                account.permission == "member" || account.permission == ""
              }
            />
          </li>
        </ul>
      </nav>
    </header>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default React.memo(Header);

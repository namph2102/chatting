import React, { useState } from "react";
import { Tooltip } from "@mui/material";

import Profile from "./Profile";
import { MenuItem } from "./MenuItem";

import { listMenu } from "./header.util";
import { cn, deFaultIconSize } from "../../servies/utils";
import { componentsProps } from "../../styles/componentsProps";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { IAccount } from "../../redux/Slice/slice.type";
import { BiSun } from "react-icons/bi";

const Header = () => {
  const [isOpenProfile, setIsOpenProfile] = useState<boolean>(false);

  const account: IAccount = useSelector(
    (state: RootState) => state.userStore.account
  );
  return (
    <header
      className={cn(
        "lg:w-[75px] w-full lg:h-screen bg-menu shadow lg:static fixed z-10 left-0 right-0 bottom-0 h-[75px]"
      )}
    >
      <nav id="nav__menu">
        <ul className="flex lg:h-screen justify-around  lg:flex-col  h-[75px]  py-6">
          {listMenu.length > 0 &&
            listMenu.map((menu) => (
              <MenuItem
                key={menu.title}
                title={menu.title}
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
                title="Dark mode"
                arrow
                placement="left"
                className="text-xl cursor-pointer"
              >
                <span
                  onClick={(e: any) => e.target.classList.toggle("active")}
                  className="lg"
                >
                  <BiSun fontSize={deFaultIconSize} />
                </span>
              </Tooltip>
            </span>
          </li>
          <li className="flex justify-center relative">
            <Tooltip
              title={isOpenProfile ? "" : "Hồ sơ của bạn"}
              placement="top"
              componentsProps={componentsProps}
              arrow
            >
              <a className="cursor-pointer">
                <img
                  onClick={() => {
                    setIsOpenProfile(!isOpenProfile);
                  }}
                  src={account.avatar || "/images/avata.jpg"}
                  width="30"
                  height="30"
                  alt="Avatar"
                  className="rounded-full object-cover"
                  id="avatarButton"
                  data-dropdown-toggle="userDropdown"
                  data-dropdown-placement="bottom-start"
                />
              </a>
            </Tooltip>

            <Profile
              isOpen={isOpenProfile}
              username={account.username}
              fullname={account.fullname}
            />
          </li>
        </ul>
      </nav>
    </header>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default React.memo(Header);

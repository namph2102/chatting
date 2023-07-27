import {
  BiChevronDown,
  BiDotsVerticalRounded,
  BiInfoCircle,
  BiPhoneCall,
  BiVideo,
} from "react-icons/bi";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux";
import {
  updateSettingVideoCall,
  updateOpenGroup,
} from "../../redux/Slice/AccountSlice";
import { FC } from "react";
import { PserSonChating } from "../../redux/Slice/ChatPersonSlice";
import { useTranslation } from "react-i18next";
import "../../servies/translate/contfigTranslate";
import { cn } from "../../servies/utils";
import i18n from "i18next";
import { Tooltip } from "@mui/material";
import { componentsProps } from "../../styles/componentsProps";
import { updateLanguage } from "../../redux/Slice/LangSlice";
interface HeaderNavRightProps {
  isChatBot: boolean;
  person: PserSonChating;
}
const HeaderNavRight: FC<HeaderNavRightProps> = ({ isChatBot, person }) => {
  const dispatchRedux: AppDispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useSelector((state: RootState) => state.userStore.theme);
  const handleOpenvideoCall = () => {
    dispatchRedux(
      updateSettingVideoCall({
        roomName: person.fullname,
        isOpen: true,
        roomId: person.idRoom,
        type: person.typechat,
      })
    );
  };

  const { listLanguage, languageCode } = useSelector(
    (state: RootState) => state.languageStore
  );
  const handleSetLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
    dispatchRedux(updateLanguage(lng));
  };
  const textLang =
    listLanguage.find((l) => l.code == languageCode)?.country || "Việt Nam";
  return (
    <div className="relative chat_options-settings_btn">
      <span className="sm:hidden block text-2xl cursor-pointer ">
        <BiDotsVerticalRounded />
      </span>
      <ul className="chat_options-settings sm:static sm:w-auto min-w-[150px] sm:pr-0 sm:py-0 py-2  pr-2 sm:border-none border-[#333333]  absolute flex sm:flex-row items-end flex-col right-0 top-10 gap-3 text-2xl  cursor-pointer">
        <li className="text-base relative language__parent sm:order-none order-3">
          <div className="flex gap-1 items-center sm:text-base text-sm capitalize ">
            {textLang} <BiChevronDown />
          </div>

          <ul
            id={theme.darkmode}
            className="absolute right-0 top-full  z-[2px] language__children"
          >
            {listLanguage.map((lang) => (
              <li key={lang.id} className="min-w-[150px]">
                <div
                  onClick={() => handleSetLanguage(lang.code)}
                  className={cn(
                    "flex gap-2 items-center cursor-pointer py-1 px-3",
                    languageCode == lang.code
                      ? "text-primary"
                      : "background-primary-hover rounded-lg"
                  )}
                >
                  <img src={lang.flag} className="w-4" alt={lang.country} />
                  <span>{lang.country}</span>
                </div>
              </li>
            ))}
          </ul>
        </li>
        <li onClick={handleOpenvideoCall} className="flex">
          <div>
            <p className="sm:hidden text-base flex justify-between items-center w-full">
              <span className="pr-2"> {t("textcall")}</span>
              <BiPhoneCall />
            </p>
            <p className="sm:block hidden">
              <Tooltip
                arrow
                placement="bottom"
                componentsProps={componentsProps}
                title={t("textcall")}
              >
                <span>
                  <BiPhoneCall />
                </span>
              </Tooltip>
            </p>
          </div>
        </li>
        <li onClick={handleOpenvideoCall} className="flex">
          <div>
            <p className="sm:hidden text-base flex justify-between items-center w-full">
              <span className="pr-2"> {"Video Call"}</span>
              <BiVideo />
            </p>
            <p className="sm:block hidden">
              <Tooltip
                arrow
                placement="bottom"
                componentsProps={componentsProps}
                title={"Video Call"}
              >
                <span>
                  <BiVideo />
                </span>
              </Tooltip>
            </p>
          </div>
        </li>

        <li
          className={cn("flex", isChatBot ? "hidden" : "")}
          onClick={() => dispatchRedux(updateOpenGroup("nopayload"))}
        >
          <div>
            <p className="sm:hidden text-base flex justify-between items-center w-full">
              <span className="pr-2"> {t("see") + " " + t("info")}</span>
              <BiInfoCircle />
            </p>
            <p className="sm:block hidden">
              <Tooltip
                arrow
                placement="bottom"
                componentsProps={componentsProps}
                title={t("see") + " " + t("info")}
              >
                <span>
                  <BiInfoCircle />
                </span>
              </Tooltip>
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default HeaderNavRight;

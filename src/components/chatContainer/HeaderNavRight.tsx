import {
  BiChevronDown,
  BiInfoCircle,
  BiPhoneCall,
  BiVideo,
} from "react-icons/bi";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux";
import {
  updateSettingVideoCall,
  updateOpenGroup,
} from "../../redux/Slice/AccountSlice";
import { FC, useState } from "react";
import { PserSonChating } from "../../redux/Slice/ChatPersonSlice";
import { useTranslation } from "react-i18next";
import "../../servies/translate/contfigTranslate";
import { cn, listLanguage } from "../../servies/utils";
import i18n from "i18next";
import { Tooltip } from "@mui/material";
import { componentsProps } from "../../styles/componentsProps";
interface HeaderNavRightProps {
  isChatBot: boolean;
  person: PserSonChating;
}
const HeaderNavRight: FC<HeaderNavRightProps> = ({ isChatBot, person }) => {
  const dispatchRedux: AppDispatch = useDispatch();
  const { t } = useTranslation();

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

  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "vi"
  );
  const handleSetLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
    setLanguage(lng);
  };
  const textLng =
    listLanguage.find((l) => l.code == language)?.country || "Việt Nam";

  return (
    <ul className="flex gap-4 text-2xl  cursor-pointer">
      <li className="text-base relative language__parent">
        <div className="flex gap-1 items-center">
          {textLng} <BiChevronDown />
        </div>

        <ul className="absolute left-0 top-full  language__children">
          {listLanguage.map((lang) => (
            <li key={lang.id} className="min-w-[150px]">
              <div
                onClick={() => handleSetLanguage(lang.code)}
                className={cn(
                  "flex gap-2 items-center cursor-pointer py-1 px-3",
                  language == lang.code
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
      <li onClick={handleOpenvideoCall} title="Call">
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
      </li>
      <li onClick={handleOpenvideoCall} title="Video">
        <Tooltip
          arrow
          placement="bottom"
          componentsProps={componentsProps}
          title={t("textcall") + " " + "Video"}
        >
          <span>
            <BiVideo />
          </span>
        </Tooltip>
      </li>
      <li
        className={cn(isChatBot ? "hidden" : "")}
        onClick={() => dispatchRedux(updateOpenGroup("nopayload"))}
      >
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
      </li>
    </ul>
  );
};

export default HeaderNavRight;

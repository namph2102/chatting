import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import "../../servies/translate/contfigTranslate";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { cn, listLanguage } from "../../servies/utils";
import { BiFlag } from "react-icons/bi";
import i18n from "i18next";

const LanguageSettings = () => {
  const { t } = useTranslation();
  const [isOpenMore, setIsOpenMore] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "vi"
  );
  const handleSetLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
    setLanguage(lng);
  };

  return (
    <>
      <li
        onClick={() => setIsOpenMore(!isOpenMore)}
        className="flex cursor-pointer justify-between border-t-[0.5px]  border-[#666666]  p-2 mt-2"
      >
        <div className="flex gap-2 items-center ">
          <span>
            <BiFlag />
          </span>
          <span className="capitalize">{t("language")}</span>
        </div>
        <button className="text-3xl">
          {!isOpenMore ? <RiArrowDropDownLine /> : <RiArrowDropUpLine />}
        </button>
      </li>
      <ul
        className={cn(
          "pl-2 relative text-sm gap-2 flex flex-col",
          isOpenMore ? "h-auto mb-3" : "h-0 overflow-hidden"
        )}
      >
        {listLanguage.map((lang) => (
          <li key={lang.id} className="px-4">
            <div
              onClick={() => handleSetLanguage(lang.code)}
              className={cn(
                "flex gap-2 items-center cursor-pointer px-2",
                language == lang.code
                  ? "text-primary"
                  : "background-primary-hover rounded-lg"
              )}
            >
              <img src={lang.flag} className="w-10" alt={lang.country} />
              <span>{lang.country}</span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default LanguageSettings;

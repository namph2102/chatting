import React, { FC } from "react";
import { BiChevronLeft } from "react-icons/bi";
import HeaderNavRight from "./HeaderNavRight";
import { HandleTimeDiff, cn } from "../../servies/utils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux";
import { setIsOpenDisplayTable } from "../../redux/Slice/AccountSlice";
import { PserSonChating } from "../../redux/Slice/ChatPersonSlice";
import { useTranslation } from "react-i18next";
import "../../servies/translate/contfigTranslate";
import moment from "moment";
import { useNavigate } from "react-router-dom";

interface IChatheader {
  person: PserSonChating;
}
// eslint-disable-next-line react-refresh/only-export-components
const ChatHeader: FC<IChatheader> = ({ person }) => {
  const navigator = useNavigate();
  const dispatchRedux: AppDispatch = useDispatch();
  const { t } = useTranslation();
  const language = localStorage.getItem("language") || "vi";

  const handlePushPageHome = () => {
    if (person._id == "chatbot") {
      navigator("/nhan-tin");
    }
    dispatchRedux(setIsOpenDisplayTable(false));
  };
  return (
    <section className=" px-4 py-3 min-h-[60px] flex items-center  border-main/5 border-b-[2px]  shadow relative z-20">
      <div className="backdrop-blur-md  absolute inset-0"></div>
      <div className="flex absolute top-0 left-0 px-4 py-auto right-0 z-10 justify-between items-center w-full">
        <div className="flex sm:gap-5 py-2 items-center gap-2">
          <button onClick={handlePushPageHome} className="lg:hidden">
            <BiChevronLeft fontSize="1.5rem" />
          </button>
          <div className="relative ">
            <img
              src={person.avatar || "/images/botai.png"}
              alt="avata"
              height={40}
              width={40}
              className="rounded-full object-cover w-10 h-10"
            />
            <div
              className={cn(
                "absolute bottom-0 left-7  w-3 h-3  border-white border-[1px]  rounded-full"
              )}
            >
              <span
                className={cn(
                  "animate-ping absolute -left-[2px] -top-[2px] w-3 h-3  inline-flex rounded-full opacity-60",
                  person.status ? " bg-status-online" : "bg-red-600"
                )}
              ></span>
              <span
                className={cn(
                  "absolute inline-flex rounded-full w-2.5 h-2.5",
                  person.status ? " bg-status-online" : "bg-red-600"
                )}
              ></span>
            </div>
          </div>
          <div>
            <h3 className=" capitalize sm:text-lg text-sm line-clamp-1 font-semibold drop-shadow-sm">
              {person.fullname}
            </h3>
            <p className="text-[12px]">
              {person.status
                ? t("online")
                : `${t("offline")} ${
                    language == "vi"
                      ? HandleTimeDiff(person.timeOff || person.updatedAt)
                      : moment(person.updatedAt).fromNow()
                  }`}
            </p>
          </div>
        </div>

        <HeaderNavRight person={person} isChatBot={person._id == "chatbot"} />
      </div>
    </section>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default React.memo(ChatHeader);

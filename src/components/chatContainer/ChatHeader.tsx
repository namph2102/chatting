import React, { FC, useState } from "react";
import { BiChevronLeft } from "react-icons/bi";
import HeaderNavRight from "./HeaderNavRight";
import { cn } from "../../servies/utils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux";
import { setIsOpenDisplayTable } from "../../redux/Slice/AccountSlice";
// extends HTMLAttributes<HTMLDivElement>
interface ChatHeaderProps {
  id: string;
}
// eslint-disable-next-line react-refresh/only-export-components
const ChatHeader: FC<ChatHeaderProps> = ({ id = "chatbox" }) => {
  const [active] = useState<boolean>(true);
  console.log(id);
  const dispatchRedux: AppDispatch = useDispatch();
  return (
    <section className=" px-4 py-4 min-h-[60px] flex items-center  border-main/10 border-b-[2px]  shadow relative z-20 top-0 ">
      <div className="bg-aside/30 backdrop-blur-sm  absolute inset-0"></div>
      <div className="flex opacity-7 absolute top-0 left-0 px-4 py-auto right-0 z-10 justify-between items-center w-full">
        <div className="flex sm:gap-5 items-center gap-2">
          <button
            onClick={() => dispatchRedux(setIsOpenDisplayTable(false))}
            className="px-1.5 lg:hidden"
          >
            <BiChevronLeft fontSize="1.5rem" />
          </button>
          <div className="relative ">
            <img
              src="/images/botai.png"
              alt="avata"
              height={40}
              width={40}
              className="rounded-full object-cover sm:w-10 sm:h-10 w-6 h-6"
            />
            <div
              className={cn(
                "absolute bottom-0 left-7  w-3 h-3  border-white border-[1px]  rounded-full"
              )}
            >
              <span
                className={cn(
                  "animate-ping absolute -left-[2px] -top-[2px] w-3 h-3  inline-flex rounded-full opacity-60",
                  active ? " bg-status-online" : "bg-red-600"
                )}
              ></span>
              <span
                className={cn(
                  "absolute inline-flex rounded-full w-2.5 h-2.5",
                  active ? " bg-status-online" : "bg-red-600"
                )}
              ></span>
            </div>
          </div>
          <div>
            <h3 className=" capitalize text-lg font-semibold drop-shadow-sm">
              ChatBot
            </h3>
            <p className="text-[12px]">{active ? "Active" : "off"}</p>
          </div>
        </div>

        <div>
          <HeaderNavRight />
        </div>
      </div>
    </section>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default React.memo(ChatHeader);

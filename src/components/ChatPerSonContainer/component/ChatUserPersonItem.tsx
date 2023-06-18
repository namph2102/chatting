import { FC } from "react";
import { cn } from "../../../servies/utils";

import { BiCheckDouble, BiDotsVerticalRounded } from "react-icons/bi";
import moment from "moment";
import ToltipProvider from "../../webmedia/component/ToltipProvider";
import { IImageFireBase } from "./MyDropzone";
import { BsDownload } from "react-icons/bs";
import { nanoid } from "@reduxjs/toolkit";
import { Link } from "react-router-dom";

export interface ChatUserPersonItemProps {
  isSee: boolean;
  isUser: boolean;
  comment: string;
  updatedAt: string;
  type: string;
  author: {
    _id: string;
    avatar: string;
    fullname: string;
  };
  file?: IImageFireBase[];
}
const ChatUserPersonItem: FC<ChatUserPersonItemProps> = (props) => {
  const classname =
    "w-[fit-content]  relative  box_chat-content   flex-start  flex-col sm:flex-row  rounded-lg font-medium pb-2 px-2 shadow-inner mt-3 ";
  return (
    <article
      className={cn(
        "flex items-end mt-3",
        props.isUser ? "flex-row-reverse gap-2" : "flex-row gap-2"
      )}
    >
      <img
        src={props.author.avatar || "/images/avata.jpg"}
        alt="avata"
        width={24}
        height={24}
        loading="lazy"
        className="sw:h-10 w-6 h-6  rounded-full object-cover"
      />

      <div className="chat_item-user  font_inter-chatting    text-base font-normal   m-w-[calc(100%-60px)]  flex flex-col gap-2">
        <div
          className={cn(
            classname,

            props.isUser
              ? "background-primary_chatting-isuser py-1 ml-20"
              : "form-control py-2 text-left mr-20"
          )}
        >
          <div
            className={cn("absolute top-1/2 hidden -translate-y-1/2 w-full")}
          >
            <ul
              className={cn(
                "text-sm font-semibold  px-2 w-[100px] text-black  text-center -translate-y-1/2 absolute bg-white drop-shadow-xl top-0",
                props.isUser ? "-left-28" : "-right-24"
              )}
            >
              <li>Xóa, Gỡ</li>
              <li>Trả lời</li>
              <li>Ghim</li>
            </ul>
            <span
              className={cn(
                "p-4 text-xl cursor-pointer absolute hidden -translate-y-1/2",
                props.isUser ? "-left-12 " : "-right-12"
              )}
            >
              <BiDotsVerticalRounded />
            </span>
          </div>
          {props.type == "text" && (
            <p className="font_inter-chatting font-light"> {props.comment}</p>
          )}
          {props.type == "image" && props.file && (
            <div className="flex flex-wrap gap-y-8 ">
              {props.file.map((file) => (
                <div
                  key={nanoid()}
                  className={cn(
                    "relative lg:w-[200px] w-[150px] h-[180px]  px-2   "
                  )}
                >
                  <img
                    className="w-[full]  object-cover h-full "
                    loading="lazy"
                    src={file.url}
                    alt="Ảnh bị lỗi rồi!"
                  />
                  <div className="absolute bottom-0 left-2 w-full right-0 h-10 flex items-center text-left">
                    <img src="images/iconimage.png" className="lg:w-10 w-8" />
                    <div className="text-sm line-clamp-1  font-normal flex flex-col  text_shadown-style">
                      <span>{file.fileName}</span>
                      <span>{(file.size / 1000).toFixed(0)} kb</span>
                    </div>
                    <Link
                      className="absolute right-4 -bottom-6 animate-bounce text-base font-bold text-primary-hover"
                      to={file.url}
                      target="_blank"
                      download={file.fileName}
                    >
                      <BsDownload />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-1 items-end font-semibold text-[0.875em] pl-1 mt-1">
            {props.isSee && (
              <ToltipProvider className="" title="Đã xem">
                <span className="cursor-pointer block pt-1">
                  <BiCheckDouble fill="rgb( 6,214,160)" />
                </span>
              </ToltipProvider>
            )}
            <span className="text-xs font-light mt-1  opacity-80">
              {moment(props.updatedAt).format("HH:mm - DD/MM")}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ChatUserPersonItem;

import { FC } from "react";
import { CapitalizeString, cn } from "../../../servies/utils";

import { BiCheckDouble, BiDotsVerticalRounded } from "react-icons/bi";
import moment from "moment";
import ToltipProvider from "../../webmedia/component/ToltipProvider";
import { IImageFireBase } from "./MyDropzone";
import { BsDownload } from "react-icons/bs";
import { nanoid } from "@reduxjs/toolkit";
import { Link } from "react-router-dom";
import "../style/chatperson.scss";

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
  _id?: string;
  action: {
    userId: string;
    kind: string;
  };
}
interface ChatUserPersonItemPropsMore extends ChatUserPersonItemProps {
  handleactiveOptions: (
    idComment: string | undefined,
    type: string,
    typeChatting: string
  ) => void;
  isAction?: boolean;
}
const ChatUserPersonItem: FC<ChatUserPersonItemPropsMore> = (props) => {
  const classname =
    "w-[fit-content]  relative  box_chat-content   flex-start  flex-col sm:flex-row  rounded-lg font-medium pb-2 px-2 shadow-inner mt-3 ";
  let message = props.comment;
  if (props.action.kind == "delete") {
    if (props.isAction) {
      message = `<span class="text-sm  italic text-red-400">${
        (props.isUser ? "Bạn" : CapitalizeString(props.author.fullname)) +
        " đã xóa nội dung này!"
      }</span>`;
    } else {
      message = !props.isUser
        ? `<span class="text-sm  italic text-red-400">Bạn đã xóa nội dung này!</span>`
        : message;
    }
  }
  const handleActionClick = (
    id: string | undefined,
    type: string,
    message: string
  ) => {
    console.log(message);
    if (!id) return;
    props.handleactiveOptions(id, type, props.type);
  };

  return (
    <article
      id={props._id || nanoid()}
      className={cn(
        "flex items-end mt-3 bg_effect-settings",
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
          <div className={cn("absolute top-1/2   -translate-y-1/2 w-full")}>
            <span
              className={cn(
                "p-4 text-xl cursor-pointer absolute openSeemore  -translate-y-1/2",
                props.isUser ? "-left-12 " : "-right-12"
              )}
            >
              <span className="span__container-next relative">
                <BiDotsVerticalRounded />
                <ul
                  className={cn(
                    "text-sm font-semibold  hidden  rounded-xl  -top-full  px-2 w-[90px] text-black  text-center absolute bg-white drop-shadow-xl ",
                    props.isUser ? "-left-16" : "-right-12"
                  )}
                >
                  <li
                    onClick={() =>
                      handleActionClick(props._id, "delete", "xóa")
                    }
                  >
                    Xóa
                  </li>
                  <li
                    onClick={() =>
                      handleActionClick(props._id, "change", "Chỉnh sửa")
                    }
                  >
                    Chỉnh sửa
                  </li>
                  <li
                    onClick={() => handleActionClick(props._id, "ghim", "ghim")}
                  >
                    Ghim
                  </li>
                </ul>
              </span>
            </span>
          </div>

          {props.type == "text" && (
            <p
              className="font_inter-chatting font-light"
              dangerouslySetInnerHTML={{ __html: message }}
            />
          )}
          {props.type == "image" && props.file && (
            <div className="flex flex-wrap gap-y-8 ">
              {props.file.map((file) => (
                <div
                  key={nanoid()}
                  className={cn("relative lg:w-[200px] w-[150px] h-[190px]")}
                >
                  <img
                    className="w-full  object-cover h-full "
                    loading="lazy"
                    src={file.url}
                    alt="Ảnh bị lỗi rồi!"
                  />
                  <div className="absolute bg-black/60 py-2 bottom-0 left-0 w-full right-0 h-12 flex items-center text-left">
                    <img src="images/iconimage.png" className="lg:w-10 w-8" />
                    <div className="text-sm  font-normal flex flex-col  text_shadown-style">
                      <span className="line-clamp-1">{file.fileName}</span>
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

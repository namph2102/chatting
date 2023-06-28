import { Tooltip } from "@mui/material";
import { componentsProps } from "../../../styles/componentsProps";
import { FC, useState } from "react";
import { ChatUserPersonItemProps } from "./ChatUserPersonItem";
import {
  CapitalizeString,
  ToastNotify,
  cn,
  handleStopPropagation,
} from "../../../servies/utils";
import moment from "moment";
import { nanoid } from "@reduxjs/toolkit";
import LinkCommentItem from "./LinkCommentItem";
import { BiDotsHorizontal } from "react-icons/bi";
import { BsDownload } from "react-icons/bs";
import { Link } from "react-router-dom";
import AudioComment from "./AudioComment";
import LoadMap from "../../chatContainer/component/LoadMap";
import DocumentComment from "./DocumentComment";
interface GhimItem extends ChatUserPersonItemProps {
  handleactiveOptions: (
    idComment: string | undefined,
    type: string,
    typeChatting: string
  ) => void;
}
const GhimItem: FC<GhimItem> = (props) => {
  const [isOpenGhim, setIsOpenGhim] = useState<boolean>(false);
  const handleActionClick = (id: string | undefined, type: string) => {
    if (type == "ghim") {
      ToastNotify("Bỏ ghim thành công").success();
    } else {
      const itemScrool = document.getElementById(
        `box_item_chat-id-${props._id}`
      );

      if (itemScrool) {
        itemScrool.scrollIntoView({ behavior: "smooth" });
      }
    }
    props.handleactiveOptions(id, type, props.type);
    setIsOpenGhim(false);
  };

  return (
    <div className="my-4 px-4 ">
      <p className="flex justify-between text-xs ">
        <span className="text-bold mb-1">
          {props.isUser ? "Bạn" : CapitalizeString(props.author.fullname)}
        </span>
        <span>{moment(props.updatedAt).format("DD/MM/YYYY - HH:mm:ss")}</span>
      </p>
      <div className="flex gap-1 items-center relative">
        <Tooltip
          title={CapitalizeString(props.author.fullname)}
          arrow
          placement="left"
          componentsProps={componentsProps}
        >
          <img
            src={props.author.avatar}
            className="rounded-full object-cover"
            width="40"
            height="40"
            alt="Errors"
          />
        </Tooltip>
        {props.type == "document" && props.file && (
          <DocumentComment {...props.file[0]} />
        )}
        {props.type == "text" && (
          <div className="text-black bg-gray-300 py-2 px-3 rounded-2xl text-sm">
            {props.comment}
          </div>
        )}
        {props.type == "audio" && (
          <AudioComment
            link={
              "https://drive.google.com/uc?export=download&id=" + props.comment
            }
          />
        )}
        {props.type == "location" && (
          <LoadMap
            hideSerachInput
            fullname={props.isUser ? "Bạn" : props.author.fullname}
          />
        )}
        {props.file && props.type !== "document" && props.file.length > 0 && (
          <div className="flex gap-1 flex-wrap">
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
                <div className="absolute text-white bg-black/60 py-2 bottom-0  left-0 w-full right-0 h-12 flex items-center text-left">
                  <img src="images/iconimage.png" className="lg:w-10 w-8" />
                  <div className="text-sm  font-normal flex flex-col ">
                    <span className="line-clamp-1">{file.fileName}</span>
                    <span>{(file.size / 1000).toFixed(0)} kb</span>
                  </div>
                  <Link
                    className="absolute right-4 bottom-1 animate-bounce text-base font-bold "
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
        {props.type == "link" && (
          <div className="md:max-w-[300px] max-w-[250px]">
            <LinkCommentItem comment={props.comment} className="" />
          </div>
        )}
        <div
          onClick={() => setIsOpenGhim((prev) => !prev)}
          className="text-gray-500 absolute   z-10 right-4 hover:bg-gray-300 cursor-pointer p-2 rounded-full "
        >
          <span>
            <BiDotsHorizontal />
          </span>
          {isOpenGhim && (
            <ul className="w-40  cursor-pointer rounded-lg absolute overflow-hidden right-0 px-1 py-2 bg-black/60 top-full  text-white text-sm">
              <li
                onClick={() => handleActionClick(props._id, "ghim")}
                className="hover:bg-gray-500  p-1"
              >
                Bỏ Ghim
              </li>
              <li
                onClick={() => handleActionClick(props._id, "viewitem")}
                className="hover:bg-gray-500  p-1 "
              >
                Xem trong đoạn chat
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default GhimItem;

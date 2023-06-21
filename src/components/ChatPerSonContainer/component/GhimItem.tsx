import { Tooltip } from "@mui/material";
import { componentsProps } from "../../../styles/componentsProps";
import { FC, useState } from "react";
import { ChatUserPersonItemProps } from "./ChatUserPersonItem";
import {
  CapitalizeString,
  ToastNotify,
  handleStopPropagation,
} from "../../../servies/utils";
import moment from "moment";
import { nanoid } from "@reduxjs/toolkit";
import LinkCommentItem from "./LinkCommentItem";
import { BiDotsHorizontal } from "react-icons/bi";
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
        {props.type == "text" && (
          <div className="text-black bg-gray-300 py-2 px-3 rounded-2xl text-sm">
            {props.comment}
          </div>
        )}
        {props.file && props.file.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {props.file.map((file) => (
              <img
                key={nanoid()}
                className="w-20 h-20 rounded-xl"
                src={file.url}
                alt={file.fileName}
              />
            ))}
          </div>
        )}
        {props.type == "link" && (
          <div className="md:max-w-[300px] max-w-[250px]">
            <LinkCommentItem comment={props.comment} className="" />
          </div>
        )}
        <div
          onClick={handleStopPropagation}
          className="text-gray-500 absolute   z-10 right-4 hover:bg-gray-300 cursor-pointer p-2 rounded-full "
        >
          <span onClick={() => setIsOpenGhim(!isOpenGhim)}>
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

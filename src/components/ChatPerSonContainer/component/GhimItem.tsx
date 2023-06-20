import { Tooltip } from "@mui/material";
import { componentsProps } from "../../../styles/componentsProps";
import { FC } from "react";
import { ChatUserPersonItemProps } from "./ChatUserPersonItem";
import { CapitalizeString } from "../../../servies/utils";
import moment from "moment";
import { nanoid } from "@reduxjs/toolkit";

const GhimItem: FC<ChatUserPersonItemProps> = (props) => {
  console.log(props);
  return (
    <div className="px-4 mt-2">
      <p className="flex justify-between text-xs">
        <span className="text-bold mb-1">
          {props.isUser ? "Bạn" : CapitalizeString(props.author.fullname)}
        </span>
        <span>{moment(props.createdAt).format("DD/MM/YYYY - HH:mm:ss")}</span>
      </p>
      <div className="flex gap-1 items-center">
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
          <div className="sm:w-80 sm:h-48 w-40 h-20 ">
            <h6 className="text-black bg-gray-400  py-2 px-3 rounded-t-3xl text-sm">
              <a
                href="https://youtube.com/watch?v=hOlo8xy3B_w&feature=share"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://youtube.com/watch?v=hOlo8xy3B_w&feature=share
              </a>
            </h6>
            <img
              className="w-full h-full"
              src="https://scontent.fsgn4-1.fna.fbcdn.net/v/t1.15752-9/330644805_901798844521660_9076737345204021718_n.jpg?stp=dst-jpg_p206x206&_nc_cat=101&cb=99be929b-3346023f&ccb=1-7&_nc_sid=aee45a&_nc_ohc=t9QjW231Hd0AX9R-_aw&_nc_ht=scontent.fsgn4-1.fna&oh=03_AdTW9qiS_wsksC6ApWv4gx_8riXsZsYmJRpIii4fJIBw0A&oe=64B8775B"
              alt=""
            />
            <p className="bg-gray-300 line-clamp-2">
              bức thư của tỷ pý rocker fiter
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GhimItem;

import { Tooltip } from "@mui/material";

import React, { FC, useRef } from "react";
import { BiCheckDouble, BiDetail, BiPlayCircle } from "react-icons/bi";
import "./chating.scss";
import { cn } from "../../servies/utils";
import { componentsProps } from "../../styles/componentsProps";
import LoadMap from "./component/LoadMap";
import YotubeContainer from "./component/Youtube";
import WeatherForecast from "./component/Weather";
import SpotifyContainer from "./component/spotify/SpotifyContainer";
import ImageChatComment from "./component/imagechatting";
import moment from "moment";
import { SpeakText, handleCopyText } from "./chat.utils";
export interface ChatContentProps {
  id: string;
  isUser: boolean;
  avatar: string;
  comment: any;
  time: string;
  type: string;
  component?: React.FC;
  isSee: boolean;
}

const ChatContent: FC<ChatContentProps> = (props) => {
  const codeRef = useRef<HTMLElement>(null);
  const classname =
    "w-[fit-content]  box_chat-content   flex-start  flex-col sm:flex-row  rounded-lg font-medium pb-2 px-2 shadow-inner mt-3 ";
  return (
    <article
      className={cn(
        "flex items-end mt-3",
        props.isUser ? "flex-row-reverse gap-2" : "flex-row gap-2"
      )}
    >
      <img
        src={props.avatar || "/images/avata.jpg"}
        alt="avata"
        width={24}
        height={24}
        loading="lazy"
        className="sw:h-10 w-6 h-6  rounded-full object-cover"
      />

      <div className="chat_item-user relative font_inter-chatting   text-base font-normal   m-w-[calc(100%-60px)]  flex flex-col gap-2">
        <div
          className={cn(
            classname,
            props.isUser
              ? "background-primary_chatting-isuser py-1 text-right "
              : "form-control py-2 text-left"
          )}
        >
          {props.type == "text" && (
            <p className="whitespace-pre-wrap pl-2">
              <code
                className="javascript whitespace-pre-wrap w-[fit-content]  font_inter-chatting indent-4"
                dangerouslySetInnerHTML={{ __html: props.comment }}
                ref={codeRef}
              ></code>
            </p>
          )}
          {props.type == "translate" && (
            <p
              className="font_inter-chatting font-light"
              dangerouslySetInnerHTML={{ __html: props.comment }}
            />
          )}

          {props.type == "image" && (
            <ImageChatComment listImage={props.comment} />
          )}

          {props.type == "location" && <LoadMap search={props.comment} />}
          {props.type == "youtube" && (
            <YotubeContainer listVideo={props.comment} />
          )}
          {props.type == "weather" && (
            <>
              <p className="text-base mb-2">
                {(props.comment.includes("*") && props.comment.split("*")[0]) ||
                  "Thời tiết hôm nay của bạn"}
              </p>
              <WeatherForecast
                latude={props.comment.split("*")[1]}
                longtude={props.comment.split("*")[2]}
              />
            </>
          )}
          {props.type == "mp3" && (
            <>
              {typeof props.comment != "string" &&
              props.comment.song.length > 0 ? (
                <SpotifyContainer listSportify={props.comment} />
              ) : (
                props.comment
              )}
            </>
          )}

          <small className="flex gap-1 items-end font-semibold text-[0.875em] pl-1 mt-1">
            {props.isSee && (
              <Tooltip
                title="Đã xem"
                arrow
                componentsProps={componentsProps}
                placement="left"
              >
                <span className="cursor-pointer">
                  <BiCheckDouble fill="rgb( 6,214,160)" />
                </span>
              </Tooltip>
            )}
            <span className="text-xs font-light mt-1  opacity-80">
              {moment(props.time).format("HH:mm:ss DD/MM/YYYY")}
            </span>
          </small>

          {!props.isUser &&
            (props.type == "text" || props.type == "translate") && (
              <>
                <div
                  onClick={(e) => handleCopyText(e, props.comment)}
                  className="absolute  text_copy  cursor-pointer right-2 bottom-2  gap-2 items-center font-light text-primary  border-[rgb(var(--primary-color))] border-[1px] rounded-sm p-1"
                >
                  <BiDetail className="text-sm" />{" "}
                  <span className="text-sm ">Sao chép văn bản</span>
                </div>
                <Tooltip
                  title="Đọc văn bản"
                  arrow
                  componentsProps={componentsProps}
                >
                  <div
                    onClick={() => SpeakText(props.comment)}
                    className="top-3  text_copy right-0 absolute cursor-pointer"
                  >
                    <BiPlayCircle className="text-3xl text-primary " />
                  </div>
                </Tooltip>
              </>
            )}
        </div>
      </div>
    </article>
  );
};

export default React.memo(ChatContent);

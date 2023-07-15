import React, { useState } from "react";
import { BiCaretDown, BiCaretRight, BiXCircle } from "react-icons/bi";
import { ChatUserPersonItemProps } from "./ChatUserPersonItem";
import { PserSonChating } from "../../../redux/Slice/ChatPersonSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { TlistGroupsMap } from "../../../redux/Slice/slice.type";

import { filePath, handleCoverSize } from "../util";
import moment from "moment";
import { nanoid } from "@reduxjs/toolkit";
import { cn } from "../../../servies/utils";
import { RiGroupLine } from "react-icons/ri";
import SidebarListMember from "./SidebarListMember";
import SidebarGroupSettings from "./SidebarGroupSettings";

interface TInfoImage {
  url: string;
  key: string;
  _id: string;
}

interface SidebarAboutLayoutProps {
  listSidebarcomment: TlistGroupsMap<ChatUserPersonItemProps[]>;
  person: PserSonChating;
  handleCloseGroup: () => void;
  setIsOpenShowImage: (isOpen: boolean) => void;
  setIsOpenFromSetting: (item: any) => any;
  callBackStatus: (idAccount: string, fullname: string) => void;
}
const SidebarAboutLayout: React.FC<SidebarAboutLayoutProps> = ({
  listSidebarcomment,
  person,
  handleCloseGroup,
  setIsOpenShowImage,
  setIsOpenFromSetting,
  callBackStatus,
}) => {
  const listGroups = useSelector(
    (state: RootState) => state.sidebarStore.listGroups
  );

  const listMemberGroup =
    listGroups[person._id] && listGroups[person._id]?.listUser.length >= 3
      ? listGroups[person._id]?.listUser.slice(0, 3)
      : listGroups[person._id]?.listUser || [];
  const listDoccument =
    (listSidebarcomment["document"] &&
      listSidebarcomment["document"].length > 0 &&
      listSidebarcomment["document"].map((item) => {
        if (item.file) {
          if (item.file[0]) {
            return {
              ...item.file[0],
              _id: item._id,
              createdAt: item.createdAt,
              fileExtension:
                filePath[
                  item.file[0].fileName.split(".").pop() || "document"
                ] || "document",
            };
          }
        }
        return null;
      })) ||
    [];

  const listLink =
    listSidebarcomment["link"] && listSidebarcomment["link"].length > 0
      ? listSidebarcomment["link"].map((content) => {
          if (!content.comment.includes("*")) return null;

          const [title, des, image, link] = content.comment.split("*");
          return {
            _id: content._id,
            title,
            des,
            image,
            link,
          };
        })
      : [];
  const [isShowMore, setIsShowMore] = useState({
    image: false,
    document: false,
    link: false,
    member: false,
  });
  const handleScroolIntroview = (id: string | any) => {
    if (!id) return;
    const itemScrool = document.getElementById(`box_item_chat-id-${id}`);

    if (itemScrool) {
      itemScrool.scrollIntoView({ behavior: "smooth" });
      handleCloseGroup();
    }
  };

  const listImageCover: TInfoImage[] = [];

  listSidebarcomment["image"] &&
    listSidebarcomment["image"]?.length > 0 &&
    listSidebarcomment["image"].map((item) => {
      if (!item.file) return null;
      item.file.map((image) => {
        if (image) {
          listImageCover.push({
            _id: item._id || "dsadsa",
            key: nanoid(),
            url: image.url,
          });
        }
      });
    });
  const [isOpenListMember, setOpenListMember] = useState(false);

  return (
    <aside className="border-l-[1px] border-gray-700  h-screen">
      <button
        onClick={() => handleCloseGroup()}
        className="text-3xl hover:text-red-500 absolute top-2 right-2"
      >
        <BiXCircle />
      </button>
      <h2 className="py-[22px] text-center font-semibold text-xl">
        Thông tin hộp thoại
      </h2>
      <hr className="" />
      <div className="overflow-y-auto max-h-[85vh]">
        <div className="flex justify-center items-center gap-2 flex-col my-2 ">
          {person.typechat == "group" && (
            <div className="grid grid-cols-2 ">
              {listMemberGroup.map((user) => (
                <img
                  key={nanoid()}
                  src={user.avatar}
                  className="w-8 h-8 rounded-full border-2 border-gray-400"
                  alt="ảnh lỗi rồi"
                />
              ))}

              <div className="w-8 h-8 bg-gray-50 flex justify-center items-center rounded-full text-xs text-black">
                {listGroups[person._id]?.listUser.length}+
              </div>
            </div>
          )}

          {person.typechat == "friend" && (
            <img
              src={person.avatar}
              className="w-16 h-16 rounded-full border-2 border-gray-400"
              alt="ảnh lỗi"
            />
          )}
          <p className="text-style__ellipsis max-w-[280px] capitalize">
            {person.fullname}
          </p>
        </div>
        {person.typechat == "group" && (
          <SidebarGroupSettings
            idRoom={person.idRoom}
            setIsOpenFromSetting={setIsOpenFromSetting}
          />
        )}

        {person.typechat == "group" && (
          <section className=" px-2">
            <div className="flex justify-between">
              <h2>Thành viên nhóm</h2>
              <span
                onClick={() =>
                  setIsShowMore((prev) => ({
                    ...prev,
                    member: !isShowMore.member,
                  }))
                }
                className="text-2xl cursor-pointer"
              >
                {isShowMore.member ? <BiCaretDown /> : <BiCaretRight />}
              </span>
            </div>
            <div
              className={cn(
                "flex flex-wrap gap-1 mt-2 ease-in duration-500  overflow-hidden",
                isShowMore.member ? "max-h-auto" : " max-h-0"
              )}
            >
              <div
                onClick={() => setOpenListMember(true)}
                className="flex gap-2 hover:opacity-80 cursor-pointer pt-2 pb-3"
              >
                <span className="text-xl">
                  <RiGroupLine />
                </span>
                <span>
                  {listGroups[person._id]?.listUser?.length || 1} thành viên
                </span>
              </div>
            </div>
          </section>
        )}

        <section className=" px-2">
          <div className="flex justify-between">
            <h2>Ảnh ({listImageCover.length})</h2>{" "}
            <span
              onClick={() =>
                setIsShowMore((prev) => ({ ...prev, image: !isShowMore.image }))
              }
              className="text-2xl cursor-pointer"
            >
              {isShowMore.image ? <BiCaretDown /> : <BiCaretRight />}
            </span>
          </div>
          <div
            className={cn(
              "flex flex-wrap gap-1 mt-2 ease-in duration-500  overflow-hidden",
              isShowMore.image ? "max-h-auto" : " max-h-16"
            )}
          >
            {listImageCover.length > 0 ? (
              listImageCover.map((image) => (
                <img
                  onClick={() => handleScroolIntroview(image._id)}
                  key={image.key}
                  src={image.url}
                  alt="Ảnh lỗi"
                  className=" w-16 h-16 object-cover border-gray-500 border-2 rounded-lg cursor-pointer hover:scale-105"
                />
              ))
            ) : (
              <p className="text-sm text-center my-2">
                Chưa có nội dung ảnh được chia sẻ trong hội thoại này?
              </p>
            )}
          </div>
        </section>
        {listImageCover.length > 0 && (
          <button
            onClick={() => setIsOpenShowImage(true)}
            className="text-center w-full bg-follow-darkmode  drop_menu-hover py-2 my-4 px-2 rounded-full cursor-pointer"
          >
            Xem tất cả
          </button>
        )}
        <section className=" px-2 mt-4">
          <div className="flex justify-between">
            <h2>
              Tài liệu (
              {listSidebarcomment["document"]
                ? listSidebarcomment["document"].length
                : 0}
              )
            </h2>
            <span
              onClick={() =>
                setIsShowMore((prev) => ({
                  ...prev,
                  document: !isShowMore.document,
                }))
              }
              className="text-2xl cursor-pointer"
            >
              {isShowMore.document ? <BiCaretDown /> : <BiCaretRight />}
            </span>
          </div>
          <div
            className={cn(
              "flex flex-wrap gap-4 mt-2 overflow-hidden ease-linear duration-500",
              isShowMore.document ? "max-h-auto" : "max-h-24"
            )}
          >
            {listDoccument.length > 0 ? (
              listDoccument.map(
                (file) =>
                  file && (
                    <div
                      onClick={() => handleScroolIntroview(file._id)}
                      key={nanoid()}
                      className="flex gap-2 w-full hover:opacity-80 cursor-pointer"
                    >
                      <img
                        src={`/images/${file?.fileExtension || "document"}.png`}
                        className="w-8 h-8 "
                        alt=""
                      />
                      <div className="w-full flex-1">
                        <p className="text-style__ellipsis max-w-[200px] text-sm">
                          {file.fileName}
                        </p>
                        <p className="text-xs mt-1 flex justify-between">
                          <span>{handleCoverSize(file.size)}</span>
                          <span className="text-xs">
                            {moment(file.createdAt).format("DD/MM/YYYY")}
                          </span>
                        </p>
                      </div>
                    </div>
                  )
              )
            ) : (
              <p className="text-sm text-center my-2">
                Chưa có nội dung tài liệu được chia sẻ torng hội thoại này?
              </p>
            )}
          </div>
        </section>
        <section className=" px-2 mt-4">
          <div className="flex justify-between">
            <h2>
              Link (
              {listSidebarcomment["link"]
                ? listSidebarcomment["link"].length
                : 0}
              )
            </h2>
            <span
              onClick={() =>
                setIsShowMore((prev) => ({
                  ...prev,
                  link: !isShowMore.link,
                }))
              }
              className="text-2xl cursor-pointer"
            >
              {isShowMore.link ? <BiCaretDown /> : <BiCaretRight />}
            </span>
          </div>
          <div
            className={cn(
              "flex flex-wrap gap-4 mt-2 overflow-hidden ease-linear duration-500",
              isShowMore.link ? "max-h-auto" : "max-h-24"
            )}
          >
            {listLink.length > 0 ? (
              listLink.map(
                (link) =>
                  link && (
                    <div
                      onClick={() => handleScroolIntroview(link._id)}
                      key={nanoid()}
                      className="flex gap-2 cursor-pointer hover:opacity-80 "
                    >
                      <img src={link.image} className="w-12 h-12 " alt="" />
                      <div>
                        <p className="text-style__ellipsis max-w-[250px]">
                          {link.title}
                        </p>
                        <p className="text-xs mt-1 text-style__ellipsis max-w-[250px]">
                          {link.des}
                        </p>
                      </div>
                    </div>
                  )
              )
            ) : (
              <p className="text-sm text-center my-2">
                Chưa có link nào được gắn trong hội thoại này?
              </p>
            )}
          </div>
        </section>
      </div>
      {person._id && person.typechat == "group" && listGroups[person._id] && (
        <SidebarListMember
          callBackStatus={callBackStatus}
          setOpenListMember={setOpenListMember}
          listMemberGroup={listGroups[person._id] || {}}
          isOpenListMember={isOpenListMember}
        />
      )}
    </aside>
  );
};

export default SidebarAboutLayout;

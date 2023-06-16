import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { useEffect, useState } from "react";
import instance from "../../config";
import NoticeItem from "./NoticeItem";
import { nanoid } from "@reduxjs/toolkit";
export interface INoticeItem {
  _id: string;
  createdAt: string;
  status: boolean;
  userAccept: string;
  fullname: string;
  userSend: {
    avatar: string;
    fullname: string;
    _id: string;
  };
  type: number;
}
const NoticePage = () => {
  const { account, noticeTotal } = useSelector(
    (state: RootState) => state.userStore
  );
  const [isShowAddFriend, setIsShowAddfriend] = useState<boolean>();
  const [listInfo, setListInfo] = useState<INoticeItem[]>([]);
  useEffect(() => {
    if (!account._id) return;
    instance
      .post("info/notice", { idUser: account._id })
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        setListInfo(data.listInfo);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [account._id, isShowAddFriend, noticeTotal]);
  return (
    <section>
      <h2 className="font-bold text-xl mb-2">Thông báo</h2>
      <ul>
        {listInfo.length > 0 &&
          listInfo.map((acc) => (
            <NoticeItem
              key={nanoid()}
              {...acc}
              fullname={account.fullname}
              setIsShowAddfriend={setIsShowAddfriend}
            />
          ))}
      </ul>
    </section>
  );
};

export default NoticePage;

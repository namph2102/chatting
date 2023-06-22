import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { useEffect, useState } from "react";
import instance from "../../config";
import NoticeItem from "./NoticeItem";

export interface INoticeItem {
  _id: string;
  createdAt: string;
  status: boolean;
  isSended: boolean;
  isAccepted: boolean;

  userAccept: {
    avatar: string;
    fullname: string;
    _id: string;
  };
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
  const [isShowAddFriend, setIsShowAddfriend] = useState<boolean>(true);
  const [listInfo, setListInfo] = useState<INoticeItem[]>([]);
  const handleCallbackRedLoad = () => {
    setIsShowAddfriend((prev) => !prev);
  };
  useEffect(() => {
    if (!account._id) return;
    instance
      .post("info/notice", { idUser: account._id })
      .then((response) => response.data)
      .then((data) => {
        const listInfosCover = data.listInfo.map((info: INoticeItem) => {
          info.isSended = info.userSend._id == account._id;
          info.isAccepted = info.userAccept._id == account._id;
          return info;
        });

        setListInfo(listInfosCover);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [account._id, isShowAddFriend, noticeTotal]);
  return (
    <section>
      <h2 className="font-bold text-xl mb-4">Thông báo</h2>
      <ul className="max-h-[calc(100vh-80px)] overflow-y-auto">
        {listInfo.length > 0 &&
          listInfo.map((acc) => (
            <NoticeItem
              key={acc._id}
              {...acc}
              setIsShowAddfriend={handleCallbackRedLoad}
            />
          ))}
      </ul>
      {listInfo.length <= 0 && (
        <div className="text-xs flex justify-center flex-col items-center">
          <img
            width={50}
            src="https://cdn-icons-png.flaticon.com/512/3959/3959701.png "
            alt=""
          />
          <p className="text-xs mt-2">Hiện tại vẫn chưa có thông báo nào!</p>
        </div>
      )}
    </section>
  );
};

export default NoticePage;

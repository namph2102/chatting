import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { useEffect, useState } from "react";
import instance from "../../config";
import NoticeItem from "./NoticeItem";
import { BiChevronLeft } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
export interface INoticeItem {
  _id: string;
  createdAt: string;
  updatedAt: string;
  status: boolean;
  isSended: boolean;
  isAccepted: boolean;
  idRoomInvited: string;
  message: string;
  userAccept: {
    avatar: string;
    fullname: string;
    _id: string;
  };
  accountID: string;
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
  const [listInfo, setListInfo] = useState<INoticeItem[]>([]);
  const handleUpdateStatus = (idNotice: string, isAccept: boolean) => {
    setListInfo((listInfo) => {
      const newNotice = listInfo.find((item) => item._id == idNotice);
      if (newNotice) {
        newNotice.type = newNotice.type + 1;
        newNotice.status = isAccept;
      }

      return [...listInfo];
    });
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
          info.accountID = account._id;
          if (info.type == 4) info.idRoomInvited = info.message;
          return info;
        });

        setListInfo(listInfosCover);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [account._id, noticeTotal]);
  const navigation = useNavigate();
  return (
    <section>
      <Helmet>
        <title>Thông báo tại Zecky</title>
        <link rel="canonical" href="" />
      </Helmet>
      <h2 className="font-bold text-xl mb-4 flex items-center">
        <button
          onClick={() => navigation("/")}
          className="px-2 text-3xl lg:hidden"
        >
          <BiChevronLeft />
        </button>
        Thông báo
      </h2>
      <ul className="max-h-[calc(100vh-80px)] overflow-y-auto">
        {listInfo.length > 0 &&
          listInfo.map((acc) => (
            <NoticeItem
              key={acc._id}
              {...acc}
              handleUpdateStatus={handleUpdateStatus}
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

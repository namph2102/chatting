import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { useEffect, useRef, useState } from "react";
import instance from "../../config";
import NoticeItem from "./NoticeItem";
import { BiChevronLeft } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import "../../servies/translate/contfigTranslate";
import { useTranslation } from "react-i18next";
import { updateNotice } from "../../redux/Slice/AccountSlice";
import { Pagination } from "@mui/material";
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
  const { t } = useTranslation();
  const [listInfo, setListInfo] = useState<INoticeItem[]>([]);
  const urlRef = useRef<HTMLUListElement>(null);
  const [limit] = useState(Math.floor(window.innerHeight / 90) || 5);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();

  const { account, noticeTotal } = useSelector(
    (state: RootState) => state.userStore
  );
  useEffect(() => {
    noticeTotal > 0 && account._id && dispatch(updateNotice(0));
    setCurrentPage(1);
  }, [noticeTotal, account._id]);

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

    (async () => {
      try {
        const res = await instance.post("info/notice", {
          idUser: account._id,
          limit,
          skip: (currentPage - 1) * limit,
        });
        const listInfoCover = res.data.listInfo || [];
        if (listInfoCover.length > 0) {
          setTotalPage(res.data.totalNotice);
          const NewlistInfoCover = listInfoCover.map((info: INoticeItem) => {
            info.isSended = info.userSend._id == account._id;
            info.isAccepted = info.userAccept._id == account._id;
            info.accountID = account._id;
            if (info.type == 4) info.idRoomInvited = info.message;
            return info;
          });
          setListInfo(NewlistInfoCover);
        }
      } catch (error) {}
    })();
  }, [noticeTotal, account._id, currentPage]);

  const navigation = useNavigate();
  const countPage = Math.ceil(totalPage / limit) || 0;
  return (
    <section className="relative md:h-[90vh] h-[80vh] overflow-y-auto">
      <Helmet>
        <title>{t("notice")} Zecky</title>
        <link rel="canonical" href="" />
      </Helmet>
      <h2 className="font-bold text-xl mb-4 flex items-center">
        <button
          onClick={() => navigation("/")}
          className="px-2 text-3xl lg:hidden"
        >
          <BiChevronLeft />
        </button>
        {t("notice")}
      </h2>
      {listInfo.length > 0 ? (
        <ul ref={urlRef} className="lg:max-w-[300px]  overflow-y-auto">
          {listInfo.map((acc) => (
            <NoticeItem
              key={acc._id}
              {...acc}
              handleUpdateStatus={handleUpdateStatus}
            />
          ))}
        </ul>
      ) : (
        <div className="text-xs flex justify-center flex-col items-center">
          <img width={50} src="/images/noticecall.png" alt="lỗi" />
          <p className="text-xs mt-2">{t("donthavenotice")}!</p>
        </div>
      )}

      {countPage > 1 && (
        <div className="flex justify-center items-center text-white notice_panation absolute left-0 right-0 bottom-0">
          <Pagination
            onChange={(e, number) => e && setCurrentPage(number)}
            count={countPage}
            siblingCount={0}
            color="primary"
          />
        </div>
      )}
    </section>
  );
};

export default NoticePage;

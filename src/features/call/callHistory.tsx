import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import instance from "../../config";

import CallHistoryItem from "./CallHistoryItem";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { BiChevronLeft } from "react-icons/bi";
export interface ICallHistory {
  _id: string;
  author: {
    _id: string;
    avatar: string;
    fullname: string;
  };
  room: {
    name: string;
    type: string;
  };

  updatedAt: string;
}
const CallHistory = () => {
  const account = useSelector((state: RootState) => state.userStore.account);
  const [listCalls, setListCall] = useState<ICallHistory[]>([]);
  useEffect(() => {
    if (!account._id) return;
    instance
      .post("info/notice/call", {
        data: { idAccount: account._id, listRoom: [...account.rooms] },
      })
      .then((res) => res.data)
      .then((data) => {
        setListCall(data.listInfoCall);
      });
  }, [account._id]);
  const navigation = useNavigate();
  return (
    <div>
      <Helmet>
        <title>Lịch sử gọi tại Zecky</title>
        <link rel="canonical" href="" />
      </Helmet>
      <h2 className="font-bold text-xl mb-4 flex items-center">
        <button
          onClick={() => navigation("/")}
          className="px-2 text-3xl lg:hidden"
        >
          <BiChevronLeft />
        </button>
        Lịch sử gọi
      </h2>
      <section className="max-h-[calc(100vh-80px)] overflow-y-auto">
        {account._id &&
          listCalls.map((item) => (
            <CallHistoryItem
              idAccount={account._id}
              item={item}
              key={item._id}
            />
          ))}
        {account._id && listCalls.length <= 0 && (
          <div className="text-xs flex justify-center flex-col items-center">
            <img width={50} src="/images/noticecall.png" alt="lỗi" />
            <p className="text-xs mt-2">Hiện tại vẫn chưa có thông báo nào!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default CallHistory;

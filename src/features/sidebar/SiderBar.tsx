import React, { useEffect, useState } from "react";

import { IUserSearch } from "./user/UserSearch";

import SkeletonLayout from "./Skeleton";
import { IUserItem } from "./user/user.type";

import { historyChatting } from "../../servies/utils";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { useMutation } from "react-query";
import instance from "../../config";

import SearchSibar from "./component/SearchSidebar";
import UserListContainer from "./user/UserListContainer";

const boxID = {
  _id: "chatbot",
  avata: "/images/botai.png",
  fullname: "ChatGPT-Plus",
  status: true,
};
let listChatDefault: IUserItem[] = [];
// eslint-disable-next-line react-refresh/only-export-components
const SiderBar = () => {
  const [_, setIsLoadding] = useState<boolean>(true);
  const [listChatting, setListchatting] =
    useState<IUserItem[]>(listChatDefault);
  const [listSearch, setListSearch] = useState<IUserSearch[]>([]);

  const { account, theme } = useSelector((state: RootState) => state.userStore);

  const listChattingLocal = historyChatting("searchHistory");
  useEffect(() => {
    getData().then((res) => {
      if (res) {
        listChatDefault = res;
        setListchatting(res);
        setIsLoadding((prev) => !prev);
      }
    });
  }, []);
  const mutation = useMutation({
    mutationFn: async (search: string) => {
      const response = await instance.post("/user/search", {
        search,
        listUserExtended: [account._id],
        limit: 5,
      });
      return response.data;
    },
    onSuccess(data: any) {
      if (!data) return;
      if (data.listUserSearchs && data.listUserSearchs.length > 0) {
        const listAccount: IUserSearch[] = [];

        data.listUserSearchs.map(
          (acc: {
            username: string;
            _id: string;
            fullname: string;
            avatar: string;
            status: boolean;
          }) => {
            const isfrend = account.friends.includes(acc._id);
            listAccount.push({
              _id: acc._id,
              avatar: acc.avatar,
              status: acc.status,
              relationship: isfrend,
              fullname: acc.fullname,
            });
          }
        );
        if (listAccount.length > 5) listAccount.length = 5;
        setListSearch(listAccount);
        return;
      }
      setListSearch(listChattingLocal.getFollow(5));
    },
  });

  return (
    <>
      <SearchSibar
        mutateFC={mutation.mutate}
        isLoading={mutation.isLoading}
        listSearch={listSearch}
        setListSearch={setListSearch}
        title="Tìm kiếm"
      />

      <section
        id={theme.darkmode}
        className="hover:overflow-y-auto   overflow-x-hidden lg:max-h-[calc(100vh-150px)] max-h-[calc(100vh-225px)]"
      >
        <div className={listChatting.length > 0 ? "hidden" : ""}>
          <SkeletonLayout />
          <SkeletonLayout />
          <SkeletonLayout />
          <SkeletonLayout />
          <SkeletonLayout />
          <SkeletonLayout />
          <SkeletonLayout />
          <SkeletonLayout />
        </div>

        {listChatting.length > 0 && (
          <div className="px-4">
            <UserListContainer title="ChatGPT" listUser={[boxID]} />
            <UserListContainer
              title="Hiện tại chỉ có thể sử dụng chatGPT Plus"
              listUser={listChatting}
            />
          </div>
        )}
      </section>
    </>
  );
};

function getData(): Promise<IUserItem[]> {
  const listUser: IUserItem[] = [
    {
      _id: "8v6of181wimXsAVGg6S7B",
      status: true,
      avata: "/images/avata.jpg",
      fullname: "Thư nguyễn",
      contentWatting: 2,
    },
    {
      _id: "sssssss",
      status: false,
      avata: "/images/avata.jpg",
      fullname: "Hoàng Mai",
    },
    {
      _id: "dsadsads",
      status: true,
      avata: "/images/avata.jpg",
      fullname: "Hoài Nam",
      contentWatting: 2,
    },
    {
      _id: "Z3GUCCdydP_OAHdAHjX4q",
      status: false,
      avata: "/images/avata.jpg",
      fullname: "Sơn Tùng MTP",
    },
  ];

  const innerPromise = new Promise<IUserItem[]>((resolve) => {
    const id = setTimeout(() => {
      resolve(listUser);
      clearTimeout(id);
    }, 2000);
  });
  return innerPromise;
}
export { getData };
// eslint-disable-next-line react-refresh/only-export-components
export default React.memo(SiderBar);

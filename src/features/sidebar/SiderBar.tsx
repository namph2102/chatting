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
import { Link } from "react-router-dom";

const boxID = {
  _id: "chatbot",
  avatar: "/images/botai.png",
  fullname: "ChatGPT-Plus",
  status: true,
};
let listChatDefault: IUserItem[] = [];
// eslint-disable-next-line react-refresh/only-export-components
const SiderBar = () => {
  const [isLoadingSidebar, setIsLoadding] = useState<boolean>(false);
  const [listChatting, setListchatting] =
    useState<IUserItem[]>(listChatDefault);
  const [listSearch, setListSearch] = useState<IUserSearch[]>([]);

  const { account, theme } = useSelector((state: RootState) => state.userStore);

  const listChattingLocal = historyChatting("searchHistory");
  useEffect(() => {
    setIsLoadding(false);
    if (!account._id) return;
    getData(account._id).then((res) => {
      if (res) {
        const listfriends = res.listfriends.friends;
        console.log(listfriends);
        listChatDefault = listfriends;
        setListchatting(listfriends);
        setIsLoadding((prev) => !prev);
      }
    });
  }, [account._id]);
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
  console.log(account.friends);
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
        <div className={"hidden"}>
          <SkeletonLayout />
          <SkeletonLayout />
          <SkeletonLayout />
          <SkeletonLayout />
          <SkeletonLayout />
          <SkeletonLayout />
          <SkeletonLayout />
          <SkeletonLayout />
        </div>

        <div className="px-4">
          {!account.username && (
            <div className="flex justify-center gap-2">
              <Link to="/dang-nhap">
                <button className="background-primary py-2 px-1  text-white rounded-full text-sm">
                  Đăng nhập
                </button>
              </Link>
              <Link to="/dang-ky">
                <button className="background-primary-hover py-2 px-2 rounded-full text-sm">
                  {" "}
                  Đăng ký
                </button>
              </Link>
            </div>
          )}

          <UserListContainer title="ChatGPT" listUser={[boxID]} />
          {listChatting.length > 0 && (
            <UserListContainer
              title="danh sách bạn bè"
              listUser={listChatting}
            />
          )}
        </div>
      </section>
    </>
  );
};

function getData(iduser: string) {
  return instance
    .post("/user/listfriend", { data: iduser, method: "post" })
    .then((res) => res.data);
}
export { getData };
// eslint-disable-next-line react-refresh/only-export-components
export default React.memo(SiderBar);

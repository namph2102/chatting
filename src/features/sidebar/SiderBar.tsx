import React, { useEffect, useState } from "react";

import { IUserSearch } from "./user/UserSearch";
import { IUserItem } from "./user/user.type";

import { historyChatting } from "../../servies/utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux";
import { useMutation } from "react-query";
import instance from "../../config";

import SearchSibar from "./component/SearchSidebar";
import UserListContainer from "./user/UserListContainer";

import { socket } from "../../components/ChatPerSonContainer/ChatPerSonContainer";
import { updateStatusSidebar } from "../../redux/Slice/SidebarSlice";
import InfoLoginUI from "./component/infoLoginUI";
import { useTranslation } from "react-i18next";
import "../../servies/translate/contfigTranslate";

const boxID: IUserItem = {
  _id: "chatbot",
  avatar: "/images/botai.png",
  fullname: "ChatGPT-Plus",
  status: true,
  idRoom: "chatbot",
  typechat: "chatbot",
};

const SiderBar = () => {
  const { t } = useTranslation();

  const [listSearch, setListSearch] = useState<IUserSearch[]>([]);
  const { account, theme } = useSelector((state: RootState) => state.userStore);
  const listChattingLocal = historyChatting("searchHistory");
  const { listFriends, listRoomGroups } = useSelector(
    (state: RootState) => state.sidebarStore
  );

  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    if (!account._id) return;
    account.friends.map((idFriend: string) => {
      socket.on(`friend-chattings-${idFriend}`, (status) => {
        dispatch(updateStatusSidebar({ idFriend, status }));
      });
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
            idRoom: string;
          }) => {
            const isfrend = account.friends.includes(acc._id);
            const accountCover = {
              _id: acc._id,
              avatar: acc.avatar,
              status: acc.status,
              relationship: isfrend,
              fullname: acc.fullname,
              idRoom: "",
            };
            if (isfrend) {
              accountCover.idRoom =
                listFriends.find((u) => u._id == acc._id)?.idRoom || "";
            }

            listAccount.push(accountCover);
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
      <section
        id={theme.darkmode}
        className="overflow-x-hidden lg:max-h-[calc(100vh-150px)] lg:min-h-[92vh] min-h-[80vh] max-h-[calc(100vh-225px)]"
      >
        <div className="px-4">
          {!account.username ? (
            <InfoLoginUI />
          ) : (
            <SearchSibar
              mutateFC={mutation.mutate}
              isLoading={mutation.isLoading}
              listSearch={listSearch}
              setListSearch={setListSearch}
              title={t("createRoom")}
            />
          )}

          <UserListContainer title={t("memberSupport")} listUser={[boxID]} />
          {listFriends && listFriends?.length > 0 && account.username && (
            <UserListContainer title={t("listFriend")} listUser={listFriends} />
          )}
          {listRoomGroups && listRoomGroups?.length > 0 && account.username && (
            <UserListContainer
              title={t("listGroup")}
              listUser={listRoomGroups}
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

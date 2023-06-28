import { useSelector } from "react-redux";
import Header from "../../features/header";
import { RootState } from "../../redux";
import { cn, historyChatting } from "../../servies/utils";
import SearchSibar from "../../features/sidebar/component/SearchSidebar";
import { useEffect, useState } from "react";

import { IUserSearch } from "../../features/sidebar/user/UserSearch";
import instance from "../../config";
import { useMutation } from "react-query";

import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserSearchPageItem, {
  IUserSearchPageItem,
} from "./component/UserSearchPageItem";
import "./serachpage.scss";
import { BiChevronLeft } from "react-icons/bi";
import { handleAddFriendSocket } from "../../servies/sockets";

export interface ISearchPage {
  address: string;
  avatar: string;
  follows: number;
  fullname: string;
  status: boolean;
  username: string;
  _id_: string;
}
const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { account, theme, noticeTotal } = useSelector(
    (state: RootState) => state.userStore
  );
  const decodedKeyword = decodeURIComponent(location.search);
  const [isOpenChat, setIsOpenChat] = useState<boolean>(false);

  let query = "";
  if (decodedKeyword.includes("=")) {
    query = decodedKeyword.split("=")[1];

    if (!query) {
      navigate("/tim-kiem/sai-cu-phap");
    }
  }
  const [listChatting, setListchatting] = useState<IUserSearchPageItem[]>([]);
  useEffect(() => {
    if (!account._id || !query) return;

    setIsOpenChat(true);
    instance
      .post("/user/page/search", {
        search: query,
        listUserExtended: [account._id],
        listFriend: account.friends,
      })
      .then((res) => res.data)
      .then((data) => {
        data.listInfoSend = data.listInfoSend.map(
          (item: any) => item.userAccept
        );

        if (data.listUserSearchs) {
          data.listUserSearchs.forEach((user: any) => {
            if (
              data.listInfoSend.includes(user._id) &&
              !account.friends.includes(user._id)
            ) {
              user.isWating = true;
            } else {
              user.isWating = false;
            }

            const totalFriendTogether =
              account.friends.length + user.friends.length;
            const coutTogether = new Set([
              ...account.friends,
              ...user.friends.map((user: any) => user._id),
            ]).size;
            user.relationship = user.friends.some(
              (user: any) => user._id == account._id
            );
            user.totalFriends = totalFriendTogether - coutTogether;
          });
        }
        setListchatting(data.listUserSearchs);
      });
  }, [query, account._id, noticeTotal, account.friends]);

  const [listSearch, setListSearch] = useState<IUserSearch[]>([]);
  const listChattingLocal = historyChatting("searchHistory");

  const mutation = useMutation({
    mutationFn: async (search: string) => {
      const response = await instance.post("/user/search", {
        search,

        listUserExtended: [account._id],
      });
      const data = await response.data;
      return data;
    },
    onSuccess(data: any) {
      if (!data) return;
      setIsOpenChat(true);
      if (data.listUserSearchs && data.listUserSearchs.length > 0) {
        const listAccount: IUserSearch[] = [];
        console.log(data.listUserSearchs);
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

  const handleAddFriends = (id: string) => {
    const data = {
      fullname: account.fullname,
      userSend: account._id,
      userAccept: id,
    };
    // add follow socket
    handleAddFriendSocket(data);
  };

  return (
    <div>
      <div className="container mx-auto relative">
        <main className="flex w-full min-h-screen">
          <Header />
          <section
            id={theme.darkmode}
            className={cn(
              "lg:min-w-[300px] min-w-full  py-6 px-2 bg-aside",
              theme.darkmode == "light-mode"
                ? "border-r-[#d5d5d5] border-r-[1px]"
                : ""
            )}
          >
            <SearchSibar
              mutateFC={mutation.mutate}
              isLoading={mutation.isLoading}
              listSearch={listSearch}
              setListSearch={setListSearch}
              title="Kết quả tìm kiếm"
            />
            <p className="mt-1">Lưu ý:</p>
            <ul className="mt-2 text-xs font-medium">
              <li>* Tìm kiếm theo họ và tên</li>
              <li>* Tìm kiếm theo Email</li>
              <li>* Tìm kiếm theo số điện thoại</li>
            </ul>
          </section>

          <section
            id={theme.darkmode}
            style={{ backgroundImage: `url(${theme.backgroundthem})` }}
            className={cn(
              "w-full lg:relative px-4 lg:h-screen  h-[calc(100vh-80px)] overflow-y-auto fixed inset-0 z-10 ",

              isOpenChat ? "open_toggle-mobile " : "hidden_toggle-mobile"
            )}
          >
            <h6 className="text-xl flex gap-2 font-medium mb-4 mt-2">
              <span
                className="cursor-pointer"
                onClick={() => setIsOpenChat(false)}
              >
                <BiChevronLeft className="lg:hidden text-3xl font-bold" />
              </span>
              <span> Mọi người</span>
            </h6>
            {listChatting.length > 0 &&
              listChatting.map((user) => (
                <UserSearchPageItem
                  key={user._id}
                  {...user}
                  handleAddFriends={handleAddFriends}
                />
              ))}
          </section>
        </main>
      </div>
    </div>
  );
};

export default SearchPage;

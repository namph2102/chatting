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
import { socket } from "../../components/ChatPerSonContainer/ChatPerSonContainer";
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
  const { account, theme } = useSelector((state: RootState) => state.userStore);
  const decodedKeyword = decodeURIComponent(location.search);

  let query = "";
  if (decodedKeyword.includes("=")) {
    query = decodedKeyword.split("=")[1];
    if (!query) {
      navigate("/tim-kiem/sai-cu-phap");
    }
  } else {
    navigate("/tim-kiem/sai-cu-phap");
  }
  const [listChatting, setListchatting] = useState<IUserSearchPageItem[]>([]);
  useEffect(() => {
    if (!account._id) return;
    instance
      .post("/user/page/search", {
        search: query,
        listUserExtended: [account._id],
        listFriend: account.friends,
      })
      .then((res) => res.data)
      .then((data) => {
        if (data.listUserSearchs) {
          data.listUserSearchs.forEach((user: any) => {
            user.relationship = user.friends.includes(account._id);
            user.totalFriends = 2;
          });
        }
        setListchatting(data.listUserSearchs);
      });
  }, [query, account._id]);

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
    console.log(id);
    const data = {
      fullname: account.fullname,
      userSend: account._id,
      userAccept: id,
    };
    socket.emit("add-friend", data);
  };
  return (
    <div>
      <div className="container mx-auto relative">
        <main className="flex w-full min-h-screen">
          <Header />
          <section
            id={theme.darkmode}
            className={cn(
              "lg:min-w-[300px] min-w-full  py-6 px-2 bg-aside ",
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
          </section>
          <section
            className="w-full pt-6 px-8"
            id={theme.darkmode}
            style={{ backgroundImage: `url(${theme.backgroundthem})` }}
          >
            <h6 className="text-xl font-medium mb-2">Mọi người</h6>
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

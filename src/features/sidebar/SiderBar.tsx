import React, { useEffect, useRef, useState } from "react";
import { BiLoaderCircle, BiSearch, BiX } from "react-icons/bi";
import UserListContainer from "./user/UserListContainer";
import UserSearch, { IUserSearch } from "./user/UserSearch";
import { Tooltip } from "@mui/material";
import SkeletonLayout from "./Skeleton";
import { IUserItem } from "./user/user.type";
import { componentsProps } from "../../styles/componentsProps";
import { Debounced, ToastNotify, historyChatting } from "../../servies/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { useMutation } from "react-query";
import instance from "../../config";
import { nanoid } from "@reduxjs/toolkit";
import { updatePerson } from "../../redux/Slice/ChatPersonSlice";

const boxID = {
  _id: "chatbot",
  avata: "/images/botai.png",
  fullname: "ChatGPT-Plus",
  status: true,
};
let listChatDefault: IUserItem[] = [];
// eslint-disable-next-line react-refresh/only-export-components
const SiderBar = () => {
  const [listSearch, setListSearch] = useState<IUserSearch[]>([]);
  const [isShowSearchBox, setIsShowSearchBox] = useState<boolean>(false);
  const [_, setIsLoadding] = useState<boolean>(true);
  const [listChatting, setListchatting] =
    useState<IUserItem[]>(listChatDefault);
  const SubSearch = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { account, theme } = useSelector((state: RootState) => state.userStore);

  let listChattingLocal = historyChatting("searchHistory");
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
              relationship: isfrend ? "bạn bè" : "",
              fullname: acc.fullname,
              isShowimage: true,
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
  const getListUserSearch = () => {
    setIsShowSearchBox(true);
    if (inputRef?.current?.value) {
      console.log(inputRef?.current?.value);

      mutation.mutate(inputRef.current?.value.trim().toLowerCase());
    }
  };
  const handleChangeinputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (SubSearch.current) {
      SubSearch.current.innerHTML = e.target.value;
    }
  };
  const resetInput = () => {
    if (SubSearch.current && inputRef.current) {
      SubSearch.current.innerHTML = "";
      inputRef.current.value = "";
      inputRef.current.blur();
      setListSearch([]);
    }
  };
  const handleForcusSearchInput = () => {
    if (!account._id) {
      ToastNotify("Bạn không thể thực hiện chức năng này!").info();
      return;
    }
    if (listSearch.length > 0) return;

    setListSearch(listChattingLocal.getFollow(5).reverse());
    setIsShowSearchBox(true);
  };
  const handleSearchAccount = (userLocal: IUserSearch) => {
    setIsShowSearchBox(true);

    listChattingLocal.add({ ...userLocal, isShowimage: false });
  };
  const handleShowAllHistorySearch = () => {
    listChattingLocal = historyChatting("searchHistory");
    if (listChattingLocal.getAll().length <= 0) return [];
    setListSearch(listChattingLocal.getAll().reverse());
    setIsShowSearchBox(true);
  };

  const dispatch = useDispatch();
  const handleGetInfoPersonChatting = (_idUser: string) => {
    const acccount: any =
      listSearch.find((acc) => acc._id === _idUser) || boxID;

    if (acccount) {
      dispatch(updatePerson(acccount));
      handleCloseSearch();
    }
  };
  const handleCloseSearch = () => {
    setIsShowSearchBox(!isShowSearchBox);
    resetInput();
  };
  return (
    <>
      <section className="mb-2 ">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold"> Chats</h2>
          <button className="w-8 h-8 hover:bg-[var(--primary-color)]  border-[1px] border-gray-500 hover:opacity-100 bg-[var(--primary-color)]  opacity-50 hover:text-[#fff] rounded-sm">
            +
          </button>
        </div>
      </section>
      <section className="mb-6 relative z-10 mt-2">
        <div className="w-full flex h-[40px] px-2  focus-within::border-[1px]   form-control   rounded-sm shadow-innerrounded-sm">
          <input
            type="text"
            id="inptuSeacr_content"
            ref={inputRef}
            disabled={account._id ? false : true}
            onFocus={handleForcusSearchInput}
            onChange={handleChangeinputSearch}
            onInput={Debounced(getListUserSearch, 1000)}
            className="w-full  h-full block   bg-transparent  text-sm  outline-none border-none  "
            placeholder="Tìm kiếm tại đây ..."
          />
          <Tooltip
            title={!isShowSearchBox ? "Tìm kiếm ngay" : "Đóng thẻ"}
            arrow
            placement="top"
            componentsProps={componentsProps}
          >
            <label htmlFor={isShowSearchBox ? "inptuSeacr_content" : "nothave"}>
              <button
                type="button"
                onClick={handleCloseSearch}
                className="w-[20px] hover:text-main/40 h-full text-center"
              >
                {!isShowSearchBox ? (
                  <BiSearch />
                ) : (
                  <BiX fontSize="24" className="text-[#f34c46]" />
                )}
              </button>
            </label>
          </Tooltip>
        </div>
        {isShowSearchBox && (
          <div
            id={theme.darkmode}
            className="absolute top-full left-0 right-0  shadow-2xl drop-shadow-xl"
          >
            <div className="flex items-center justify-between py-2 px-1">
              <h2 className="font-bold text-base ">Gần đây</h2>
              <p>
                <button
                  onClick={handleShowAllHistorySearch}
                  className="text-sm text-primary-hover text-blue-600"
                >
                  Xem tất cả
                </button>
              </p>
            </div>
            {/* show list userSreach */}
            {listSearch.length > 0 &&
              listSearch.map((acc) => (
                <div key={nanoid()} onClick={() => handleSearchAccount(acc)}>
                  <UserSearch callback={handleGetInfoPersonChatting} {...acc} />
                </div>
              ))}

            <article className=" flex items-center justify-between hover:bg-main/20 py-3 px-1 cursor-pointer">
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  className="py-2 px-2 bg-main hover:bg-main/80 btn_search--bg rounded-full text-center"
                >
                  <BiSearch className="text-[#cfcdcd]" />
                </button>
                <p className="text-main text-xs font-bold">
                  Tìm kiếm: <span ref={SubSearch}></span>
                </p>
              </div>
            </article>
            {mutation.isLoading && (
              <article className="w-full py-4 flex justify-center items-center">
                <BiLoaderCircle className="fill-main/60 inline-block text-lg animate-spin" />
              </article>
            )}
          </div>
        )}
      </section>
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

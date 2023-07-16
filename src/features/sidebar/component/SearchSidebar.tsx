import React, { useRef, useState, FC } from "react";
import { BiLoaderCircle, BiSearch, BiX } from "react-icons/bi";
import { Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { componentsProps } from "../../../styles/componentsProps";
import { RootState } from "../../../redux";
import UserSearch, { IUserSearch } from "../user/UserSearch";
import {
  Debounced,
  ToastNotify,
  historyChatting,
} from "../../../servies/utils";
import { MutateOptions } from "react-query";
import {
  updatePerson,
  updateIsOpenFormRoom,
} from "../../../redux/Slice/ChatPersonSlice";
import { useNavigate } from "react-router-dom";
import { setIsOpenDisplayTable } from "../../../redux/Slice/AccountSlice";
import "../../../servies/translate/contfigTranslate";
import { useTranslation } from "react-i18next";

interface SearchSibarProps {
  title: string;
  isLoading: boolean;
  mutateFC: (
    variables: string,
    options?: MutateOptions<any, unknown, string, unknown> | undefined
  ) => void;
  listSearch: IUserSearch[];
  setListSearch: (listSearch: IUserSearch[]) => void;
}
const SearchSibar: FC<SearchSibarProps> = ({
  isLoading,
  mutateFC,
  title,
  listSearch,
  setListSearch,
}) => {
  const { t } = useTranslation();
  const [isShowSearchBox, setIsShowSearchBox] = useState<boolean>(false);

  const SubSearch = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { account, theme } = useSelector((state: RootState) => state.userStore);
  const navigate = useNavigate();
  const listChattingLocal = historyChatting("searchHistory");

  const getListUserSearch = () => {
    setIsShowSearchBox(true);
    if (inputRef?.current?.value) {
      let search = inputRef?.current?.value;
      if (search[0] == "0") search = search.slice(1);
      search && mutateFC(search.trim().toLowerCase());
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
    handleCloseSearch();

    listChattingLocal.add({ ...userLocal, isShowimage: false });
  };
  const navigator = useNavigate();
  const handleShowAllHistorySearch = () => {
    navigator("/tim-kiem?q=getall");
    setIsShowSearchBox(true);
  };

  const dispatch = useDispatch();
  const listFriends = useSelector(
    (state: RootState) => state.sidebarStore.listFriends
  );
  const handleGetInfoPersonChatting = (_idUser: string) => {
    const acccount: any = listFriends.find((acc) => acc._id === _idUser) || {};
    if (acccount?.idRoom) {
      dispatch(updatePerson(acccount));
      dispatch(setIsOpenDisplayTable(true));
      handleCloseSearch();
      navigate("/nhan-tin");
    }
  };
  const handleCloseSearch = () => {
    setIsShowSearchBox(() => false);
    resetInput();
  };

  const handleOpenFormCreateRoom = () => {
    dispatch(updateIsOpenFormRoom(true));
  };

  return (
    <>
      <section className="mb-2 ">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Tooltip
            arrow
            placement="bottom"
            title={t("createRoom")}
            componentsProps={componentsProps}
          >
            <button
              onClick={handleOpenFormCreateRoom}
              className="w-8 h-8 hover:bg-[var(--primary-color)]  border-[1px] border-gray-500 hover:opacity-100 bg-[var(--primary-color)]  opacity-50 hover:text-[#fff] rounded-sm"
            >
              +
            </button>
          </Tooltip>
        </div>
      </section>
      <section className="mb-6 relative z-10 mt-2">
        <div className="w-full flex h-[40px] px-2  focus-within::border-[1px]   form-control   rounded-sm shadow-innerrounded-sm">
          <input
            type="text"
            id="inptuSeacr_content"
            autoComplete="off"
            ref={inputRef}
            disabled={account._id ? false : true}
            onFocus={handleForcusSearchInput}
            onChange={handleChangeinputSearch}
            onInput={Debounced(getListUserSearch, 1000)}
            className="w-full  h-full block   bg-transparent  text-sm  outline-none border-none  "
            placeholder={t("searchFriends")}
          />
          <Tooltip
            title={!isShowSearchBox ? t("search") : t("close")}
            arrow
            placement="right"
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
        {isShowSearchBox &&
          (inputRef?.current?.value || listSearch.length > 0) && (
            <div
              id={theme.darkmode}
              className="absolute top-full left-0 right-0  shadow-2xl drop-shadow-xl"
            >
              <div className="flex items-center justify-between py-2 px-1">
                <h2 className="font-bold text-base ">{t("recently")}</h2>
                <p>
                  <button
                    onClick={handleShowAllHistorySearch}
                    className="text-sm text-primary-hover text-blue-600"
                  >
                    {t("seeAll")}
                  </button>
                </p>
              </div>
              {/* show list userSreach */}
              {listSearch.length > 0 &&
                listSearch.map((acc) => (
                  <div key={nanoid()} onClick={() => handleSearchAccount(acc)}>
                    <UserSearch
                      callback={handleGetInfoPersonChatting}
                      {...acc}
                    />
                  </div>
                ))}

              <article className=" flex items-center justify-between hover:bg-main/20 py-3 px-1 cursor-pointer">
                <div className="flex gap-2 items-center">
                  <button
                    type="button"
                    onClick={getListUserSearch}
                    className="py-2 px-2 bg-main hover:bg-main/80 btn_search--bg rounded-full text-center"
                  >
                    <BiSearch className="text-[#cfcdcd]" />
                  </button>
                  <p className="text-main text-xs font-bold">
                    {t("search")}: <span ref={SubSearch}></span>
                  </p>
                </div>
              </article>
              {isLoading && (
                <article className="w-full py-4 flex justify-center items-center">
                  <BiLoaderCircle className="fill-main/60 inline-block text-lg animate-spin" />
                </article>
              )}
            </div>
          )}
      </section>
    </>
  );
};

export default SearchSibar;

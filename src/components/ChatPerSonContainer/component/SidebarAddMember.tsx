import { BiSearch, BiX } from "react-icons/bi";
import ModalProviderOverlay from "../../Ui/ModalProviderOverlay";

import { IFriend } from "../../../redux/Slice/slice.type";
import { FC, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { useTranslation } from "react-i18next";
import "../../../servies/translate/contfigTranslate";
interface ISearchMember extends IFriend {
  isJoined: boolean;
}
interface IlistCheckboxed {
  _id: string;
  isJoined: boolean;
  isCheckbox: boolean;
}

import { PserSonChating } from "../../../redux/Slice/ChatPersonSlice";
import { nanoid } from "@reduxjs/toolkit";
import { socket } from "../ChatPerSonContainer";
import { Debounced, ToastNotify } from "../../../servies/utils";
interface SidebarAddMemberProps {
  person: PserSonChating;
  accountID: string;
  theme: {
    backgroundthem: string;
    darkmode: string;
    primaryColor: string;
  };
  accountFullname: string;
  setIsOpenFromSetting: (item: any) => any;
}
const SidebarAddMember: FC<SidebarAddMemberProps> = ({
  theme,
  person,
  accountID,
  accountFullname,
  setIsOpenFromSetting,
}) => {
  const { t } = useTranslation();
  const handleClose = () => {
    setIsOpenFromSetting((prev: any) => ({ ...prev, formadd: false }));
  };
  const { listFriends, listGroups } = useSelector(
    (state: RootState) => state.sidebarStore
  );

  const listAccountInRooms: string[] = listGroups[person._id].listUser.map(
    (u) => u._id
  );

  const [listFriendCover, setListFriendCover] = useState<
    Record<string, ISearchMember[]>
  >({});
  const [listCheckbox, setListCheckBox] = useState<
    Record<string, IlistCheckboxed>
  >({});

  const listCheckboxesCover: Record<string, IlistCheckboxed> = {};
  const [search, setSearch] = useState<string>("");
  useEffect(() => {
    const coverListFriend: Record<string, ISearchMember[]> = {};
    listFriends.forEach((user) => {
      const isJoined = listAccountInRooms.includes(user._id);
      listCheckboxesCover[user._id] = {
        _id: user._id,
        isCheckbox: isJoined,
        isJoined,
      };
      if (!coverListFriend[user.fullname[0]]) {
        coverListFriend[user.fullname[0]] = [
          {
            ...user,
            isJoined,
          },
        ];
      } else {
        coverListFriend[user.fullname[0]].push({
          ...user,
          isJoined,
        });
      }
    });
    setListFriendCover(coverListFriend);
    setListCheckBox(listCheckboxesCover);
    return () => {
      setSearch("");
    };
  }, []);

  const handleChecked = (status: boolean, id: string) => {
    setListCheckBox((listCheckboxPrev) => {
      if (listCheckboxPrev[id]) {
        listCheckboxPrev[id].isCheckbox = status;
      }
      return { ...listCheckboxPrev };
    });
  };
  const handleStatusAccept = (isAccept: boolean) => {
    if (isAccept) {
      try {
        const listIdInvited =
          Object.values(listCheckbox)
            .filter((item) => item.isCheckbox == true && item.isJoined == false)
            .map((item) => item._id) || [];
        if (listIdInvited.length > 0) {
          const dataSoccetAccpept = {
            idRoom: person.idRoom,
            userSendID: accountID,
            listIdInvited,
            fullname: accountFullname,
            nameRoom: person.fullname,
          };

          socket.emit("invite-to-join-group", dataSoccetAccpept);
          ToastNotify(`${t("send")} ${t("invited")} ${t("sucess")}`).success();
          handleClose();
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      setListCheckBox((prev) => {
        Object.values(listCheckbox).forEach((item) => {
          if (!item.isJoined) {
            item.isCheckbox = false;
          }
        });

        return { ...prev };
      });
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const handleDebound = () => {
    if (inputRef.current?.value) {
      setSearch(inputRef.current.value);
    }
  };

  return (
    <ModalProviderOverlay setIsCloseModal={handleClose}>
      <div
        id={theme.darkmode}
        className="sm:w-[600px] w-full min-w-[320px]  p-2 rounded-sm  "
      >
        <section className="flex justify-between px-2 items-center">
          <h5 className="text-xl my-2 capitalize">
            {t("add")} {t("member")}
          </h5>
          <button onClick={handleClose} className="text-3xl">
            <BiX />
          </button>
        </section>
        <section>
          <div className="form-control flex items-center gap-2 py-2 px-2">
            <BiSearch />
            <input
              type="text"
              ref={inputRef}
              onChange={Debounced(handleDebound, 300)}
              className="flex-1 border-none outline-0 bg-transparent text-sm"
              placeholder={t("findSeachinListFriends")}
            />
          </div>
        </section>
        <section className="my-4 border-t-2 border-b-2 border-gray-500 h-[50vh] overflow-y-auto">
          {Object.entries(listFriendCover).map(
            ([key, listAccount]) =>
              key &&
              listAccount &&
              listAccount?.length > 0 && (
                <div key={nanoid()}>
                  <h6 className="text-bold text-sm mt-2 capitalize">{key}</h6>
                  <ul className="w-ful text-sm font-medium">
                    {listAccount.map(
                      (accocunt) =>
                        accocunt.fullname.includes(search) && (
                          <li key={nanoid()} className="w-full cursor-pointer">
                            <div className="flex gap-2 items-center pl-3 cursor-pointer">
                              <input
                                id={accocunt._id + "-checkbox"}
                                type="checkbox"
                                onChange={(e) =>
                                  handleChecked(e.target.checked, accocunt._id)
                                }
                                checked={listCheckbox[accocunt._id].isCheckbox}
                                disabled={listCheckbox[accocunt._id].isJoined}
                                className="w-4 h-4 text-blue-600 "
                              />
                              <label
                                htmlFor={accocunt._id + "-checkbox"}
                                className="w-full flex items-center gap-1  py-3 cursor-pointer "
                              >
                                <img
                                  src={accocunt.avatar}
                                  className="w-12 h-12 rounded-full"
                                  alt="ảnh lỗi"
                                />
                                <div>
                                  <p className="font-bold text-sm capitalize">
                                    {accocunt.fullname}
                                  </p>
                                  {accocunt.isJoined && (
                                    <p className="font-normal text-xs">
                                      {t("isJoined")}
                                    </p>
                                  )}
                                </div>
                              </label>
                            </div>
                          </li>
                        )
                    )}
                  </ul>
                </div>
              )
          )}
        </section>
        <section
          onClick={() => handleStatusAccept(false)}
          className="flex justify-end gap-2"
        >
          <button className="py-2 px-5 text-black hover:opacity-100 opacity-80 bg-gray-50 rounded-2xl">
            {t("cancel")}
          </button>
          <button
            onClick={() => handleStatusAccept(true)}
            className="py-2 px-5 background-primary-hover background-primary opacity-80 hover:opacity-100 rounded-2xl text-base "
          >
            {t("accept")}
          </button>
        </section>
      </div>
    </ModalProviderOverlay>
  );
};

export default SidebarAddMember;

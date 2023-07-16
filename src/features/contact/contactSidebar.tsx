import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { BiChevronLeft } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import "../../servies/translate/contfigTranslate";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { useEffect, useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import UserItem from "../sidebar/user/UserItem";
import { IUserItem } from "../sidebar/user/user.type";
import InfoLoginUI from "../sidebar/component/infoLoginUI";

const ContactSidebar = () => {
  const navigation = useNavigate();
  const [listFriendCover, setListFriendCover] = useState<
    Record<string, IUserItem[]>
  >({});
  const { t } = useTranslation();
  const listFriends = useSelector(
    (state: RootState) => state.sidebarStore.listFriends
  );
  const account = useSelector((state: RootState) => state.userStore.account);
  useEffect(() => {
    if (listFriends.length == 0) return;
    const coverListFriend: Record<string, IUserItem[]> = {};
    listFriends.forEach((user) => {
      if (!coverListFriend[user.fullname[0]]) {
        coverListFriend[user.fullname[0]] = [
          {
            ...user,
          },
        ];
      } else {
        coverListFriend[user.fullname[0]].push({
          ...user,
        });
      }
    });
    setListFriendCover(coverListFriend);
  }, [listFriends.length]);

  return (
    <section>
      <Helmet>
        <title>{t("contact")} Zecky</title>
      </Helmet>
      <h2 className="font-bold text-xl mb-4 flex items-center">
        <button
          onClick={() => navigation("/")}
          className="px-2 text-3xl lg:hidden"
        >
          <BiChevronLeft />
        </button>
        {t("contact")}
      </h2>
      <article className="my-4 overflow-y-auto max-h-[calc(100vh-90px)]">
        {account._id &&
          Object.entries(listFriendCover).map(
            ([key, listAccount]) =>
              key &&
              listAccount &&
              listAccount?.length > 0 && (
                <div key={nanoid()}>
                  <h6 className="text-bold text-sm  capitalize text-primary">
                    {key}
                  </h6>
                  <ul className="w-ful text-sm font-medium">
                    {listAccount.map((accocunt) => (
                      <li key={accocunt._id} className="mb-2 ml-2">
                        <UserItem user={accocunt} />
                      </li>
                    ))}
                  </ul>
                </div>
              )
          )}
        {account._id && Object.entries(listFriendCover).length <= 0 && (
          <p>{t("dontfriend")}</p>
        )}
        {!account._id && <InfoLoginUI />}
      </article>
    </section>
  );
};

export default ContactSidebar;

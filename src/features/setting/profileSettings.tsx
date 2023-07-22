import { FC, useState } from "react";

import { BiCamera } from "react-icons/bi";
import { IAccount } from "../../redux/Slice/slice.type";
import handleImageFirebase from "../../components/ChatPerSonContainer/util/handleImageFirebase";
import { AppDispatch } from "../../redux";
import { useDispatch } from "react-redux";
import {
  updateFieldAccount,
  updateNotice,
} from "../../redux/Slice/AccountSlice";
import { socket } from "../../components/ChatPerSonContainer/ChatPerSonContainer";
import { CapitalizeString, ToastNotify } from "../../servies/utils";
import { Tooltip } from "@mui/material";
import { componentsProps } from "../../styles/componentsProps";
import { LoaddingOverLay } from "../../components/loading";
import "../../servies/translate/contfigTranslate";
import { useTranslation } from "react-i18next";
const ProfileSettings: FC<{ account: IAccount }> = ({ account }) => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const handleChangeAvata = async (e: any) => {
    if (!e) return;
    setIsLoading(true);
    const file: File = e.target.files[0];
    try {
      const result = await handleImageFirebase.uploadimage("avata", file);
      if (!result) return;
      const data = { avatar: result.url, pathAvatar: result.path };
      if (result) {
        dispatch(updateFieldAccount(data));
        // update and xóa path của hình ảnh
        account.pathAvatar &&
          (await handleImageFirebase.deleteImage(account.pathAvatar));
        socket.emit("user-update-avatar-profile", {
          ...data,
          listFriend: account.friends,
        });

        ToastNotify(
          `${CapitalizeString(t("change"))} ${t("avatar")} ${t("success")}`
        ).success();
        e.target.value = null;
        dispatch(updateNotice(1));
      }
    } catch (error) {
      ToastNotify(
        `${CapitalizeString(t("change"))} ${t("avatar")} ${t("error")}`
      ).error();
    }
    setIsLoading(false);
  };
  const handleChangeBackgroundImage = async (e: any) => {
    if (!e) return;
    setIsLoading(true);
    const file: File = e.target.files[0];
    try {
      const result = await handleImageFirebase.uploadimage("avata", file);
      if (result) {
        const data = { background: result.url, pathBackground: result.path };
        // update and xóa path cảu background
        account.pathBackground &&
          (await handleImageFirebase.deleteImage(account.pathBackground));
        dispatch(updateFieldAccount(data));
        socket.emit("user-update-background-profile", data);
      }
      ToastNotify(`${t("change")} ${t("success")}`).success();
      dispatch(updateNotice(1));
    } catch (error) {
      ToastNotify(`${t("change")} ${t("error")}`).error();
    }
    setIsLoading(false);
  };
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div
      style={{
        backgroundImage: `url(${
          account.background || "/images/background.png"
        })`,
      }}
      className={`w-full h-28 relative bg-center bg-cover bg-no-repeat`}
    >
      {isLoading && <LoaddingOverLay />}
      <Tooltip
        title={`${t("change")} ${t("backgroundAvatar")}`}
        arrow
        placement="bottom"
        componentsProps={componentsProps}
      >
        <button className="absolute right-2 top-2 py-2 text-2xl cursor-pointer bottom-[1px] background-primary  w-8 h-8 rounded-full flex items-center justify-center">
          <label
            className="cursor-pointer"
            htmlFor="user-profile-upload-background-image"
          >
            <BiCamera />
          </label>
        </button>
      </Tooltip>
      <input
        onChange={handleChangeBackgroundImage}
        id="user-profile-upload-background-image"
        type="file"
        className="hidden"
      />
      <div className="w-16 h-16  absolute -bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2">
        <img
          className="object-cover rounded-full border-primary_style-document  border-4  w-16 h-16"
          src={account.avatar}
        />
        <label
          htmlFor="user-profile-upload"
          title={`${t("change")} ${t("avatar")}`}
          className="absolute cursor-pointer bottom-[1px] -right-1 background-primary  w-6 h-6 rounded-full flex items-center justify-center"
        >
          <BiCamera />
        </label>
      </div>

      <input
        onChange={handleChangeAvata}
        id="user-profile-upload"
        type="file"
        className="hidden"
      />
    </div>
  );
};

export default ProfileSettings;

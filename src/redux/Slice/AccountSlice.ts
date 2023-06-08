import { createSlice } from "@reduxjs/toolkit";

import { initialAccount } from "./initvalue.util";
import { AppDispatch } from "..";
import { IAccount } from "./slice.type";
import instance from "../../config";
const theme = {
  backgroundthem: "/theme/theme4.png",
  darkmode: "dark-mode",
  primaryColor: "#4eac6d",
};

const AccountSlice = createSlice({
  name: "account",
  initialState: {
    account: initialAccount,
    theme,
    accessTokenSpotify: "",
    isOpenChat: true,
    isOpencallVideo: false,
  },
  reducers: {
    UpdateAccount: (state, action) => {
      state.account = action.payload;
    },
    setIsOpenDisplayTable: (state, action) => {
      state.isOpenChat = !action.payload;
    },
    setIsopenCallvideo: (state, action) => {
      state.isOpencallVideo = action.payload;
    },
    updateAccesTokenSpotify: (state, action) => {
      state.accessTokenSpotify = action.payload;
    },
  },
});
export default AccountSlice.reducer;
export const {
  UpdateAccount,
  setIsOpenDisplayTable,
  setIsopenCallvideo,
  updateAccesTokenSpotify,
} = AccountSlice.actions;

type PayloadCreateAccount = Pick<
  IAccount & { password: string },
  "fullname" | "username" | "password"
>;

// create new  account
export const CreateAccount = (
  payload: PayloadCreateAccount,
  signal: AbortSignal
) => {
  return async (dispach: AppDispatch) => {
    let message = "";
    return instance
      .post("/user/create", {
        data: payload,
        signal,
      })
      .then((response: { data: any }) => {
        const data = response.data;

        const account: IAccount = data.account;
        message = data.message || "Tạo tài khoảng thành công!";

        instance.defaults.headers.common["Authorization"] = account.accessToken;
        localStorage.setItem("accessToken", account.accessToken);
        localStorage.setItem("username", account.username);
        dispach(AccountSlice.actions.UpdateAccount(account));
        return message;
      })
      .catch((error) => {
        message =
          error?.response?.data.message ||
          "Hình như lỗi gì đó bạn hãy tạo lại!";
        throw new Error(message);
      });
  };
};

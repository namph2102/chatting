import { createSlice } from "@reduxjs/toolkit";

import { initialAccount } from "./initvalue.util";
import { AppDispatch } from "..";
import { IAccount } from "./slice.type";
import instance from "../../config";
import { ToastNotify } from "../../servies/utils";
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
  "fullname" | "username" | "password" | "avatar" | "uid"
>;
const acctackToken = (username: string, accessToken: string) => {
  instance.defaults.headers.common["Authorization"] = accessToken;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("username", username);
};
// create new  account
export const CreateAccount = (
  payload: PayloadCreateAccount,
  signal: AbortSignal
) => {
  return async (dispatch: AppDispatch) => {
    let message = "";
    return instance
      .post("/user/create", {
        data: payload,
        signal,
      })
      .then((response: { data: any }) => {
        const data = response.data;

        const account: IAccount = data.account;
        message = data.message || "Tạo tài khoản thành công!";
        uploadFullAccount(dispatch, account);
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
export const LoginAccount = (
  payload: Pick<PayloadCreateAccount, "username" | "password">,
  signal: AbortSignal
) => {
  return async (dispatch: AppDispatch) => {
    return instance
      .post("user/login", { data: payload, signal })
      .then((res) => {
        if (res?.data?.account) {
          const account = res?.data?.account;
          uploadFullAccount(dispatch, account);
          ToastNotify("Bạn đang nhập thành công").success({ autoClose: 2000 });
          return true;
        }
      })
      .catch((error) => {
        ToastNotify(
          error?.response?.data.message ||
            "Lỗi sever! Bạn vui lòng liên hệ admin"
        ).warning({ autoClose: 4000 });
        return false;
      });
  };
};
export const uploadFullAccount = (dispatch: AppDispatch, account: IAccount) => {
  // đính token
  if (account.username && account.accessToken) {
    acctackToken(account.username, account.accessToken);
  }
  dispatch(AccountSlice.actions.UpdateAccount(account));
};

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { initialAccount } from "./initvalue.util";
import { AppDispatch } from "..";
import { IAccount } from "./slice.type";
import instance from "../../config";
import { ToastNotify } from "../../servies/utils";
import { socket } from "../../components/ChatPerSonContainer/ChatPerSonContainer";
import { getDataListFriend } from "./SidebarSlice";
const theme = {
  backgroundthem: "/theme/theme4.png",
  darkmode: localStorage.getItem("darkmode") || "dark-mode",
  primaryColor: "#4eac6d",
};

const AccountSlice = createSlice({
  name: "account",
  initialState: {
    noticeTotal: 0,
    account: initialAccount,
    theme,
    accessTokenSpotify: "",
    isOpenChat: false,
    settingVideoCall: {
      roomName: "",
      isOpen: false,
      roomId: "",
      type: "group",
      join: false,
    },
    isOpenGroup: false,
    idPeerJs: "",
    idCallPeerJsNow: false,
  },
  reducers: {
    UpdateAccount: (state, action) => {
      state.account = action.payload;
    },
    setIsOpenDisplayTable: (state, action) => {
      state.isOpenChat = !action.payload;
    },
    updateSettingVideoCall: (state, action) => {
      state.settingVideoCall = { ...state.settingVideoCall, ...action.payload };
    },
    updateAccesTokenSpotify: (state, action) => {
      state.accessTokenSpotify = action.payload;
    },
    updateTheme: (state, action) => {
      state.theme = { ...state.theme, ...action.payload };
    },
    updateNotice: (state, action) => {
      if (action.payload == 0) {
        state.noticeTotal = 0;
      } else state.noticeTotal += action.payload;
    },
    updateOpenGroup(state, action) {
      if (action.payload == true || action.payload == false) {
        state.isOpenGroup = action.payload;
      } else state.isOpenGroup = !state.isOpenGroup;
    },
    updateFieldAccount(state, action) {
      state.account = { ...state.account, ...action.payload };
    },
    updateRoomsAccount(state, action) {
      if (state.account.rooms?.length != action.payload?.length)
        state.account.rooms = action.payload || [];
    },
    updatePeerjs(state, action) {
      state.idPeerJs = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(firstloginWebsite.fulfilled, (state, action) => {
      if (action.payload?.accessToken) {
        state.account = action.payload;
        acctackToken(action.payload.accessToken);
      }
    });
  },
});
export default AccountSlice.reducer;
export const {
  UpdateAccount,
  updateNotice,
  setIsOpenDisplayTable,
  updateSettingVideoCall,
  updateFieldAccount,
  updateAccesTokenSpotify,
  updateOpenGroup,
  updateTheme,
  updateRoomsAccount,
  updatePeerjs,
} = AccountSlice.actions;

type PayloadCreateAccount = Pick<
  IAccount & { password: string },
  "fullname" | "username" | "password" | "avatar" | "uid"
>;
const acctackToken = (accessToken: string) => {
  instance.defaults.headers.common["Authorization"] = "Bearer  " + accessToken;
  localStorage.setItem("accessToken", accessToken);
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
        dispatch(getDataListFriend(account._id));
        return message;
      })
      .catch((error) => {
        message = error?.response?.data?.message || "đã tồn tại";
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
    acctackToken(account.accessToken);
  }
  if (account._id) {
    socket.emit("client-acttaced-id", account._id);
  }

  dispatch(AccountSlice.actions.UpdateAccount(account));
  dispatch(getDataListFriend(account._id));
};
export const firstloginWebsite = createAsyncThunk(
  "/user/firstlogin",
  async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Tài khoản chưa đăng nhập lần nào");
      }

      return instance
        .get("/user/firstlogin")
        .then((res) => {
          if (res.data.account) {
            return res.data.account;
          }
        })
        .catch(() => {
          console.error("Tài khoản chưa đăng ký lần nào");
          return false;
        });
    } catch (err: { message: string } | any) {
      console.error(err.message);
      return false;
    }
  }
);

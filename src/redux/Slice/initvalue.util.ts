import { IAccount } from "./slice.type";

export const initialAccount: IAccount = {
  _id: "",
  fullname: "",
  username: "",
  avatar: "/images/avata.jpg",
  accessToken: "",
  refreshToken: "",
  follows: "",
  friends: [],
  uid: "",
  rooms: [],
  blocked: false,
  permission: "",
  address: "",
  phone: "",
  pathAvatar: "",
  pathBackground: "",
  email: "",
  background: "/images/background.png",
};

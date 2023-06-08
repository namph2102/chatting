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
  rooms: [],
  blocked: false,
  permission: "",
  address: "",
  phone: "",
  email: "",
};

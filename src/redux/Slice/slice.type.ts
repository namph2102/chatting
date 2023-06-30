export interface IAccount {
  _id: string;
  fullname: string;
  username: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
  follows: string;
  friends: string[];
  rooms: string[];
  blocked: boolean;
  permission: string;
  uid: string;
  address: string;
  phone: string;
  email: string;
}
export interface IUserItem {
  status: boolean;
  fullname: string;
  contentWatting?: number;
  avatar: string;
  _id: any | string;
}
export interface IListrooms {
  _id: string;
  listUser: IUserItem[];
  type: "friend" | "group";
  name: string;
  role: IUserItem;
  avatar: { path: string; url: string };
  des: string;
}
export interface IFriend extends IUserItem {
  typechat: "friend" | "group" | "chatbot";
  idRoom: string;
  des?: string;
}
export interface typeMapItem {
  name: string;
  typechat: "friend" | "group" | "chatbot";
  idRoom: string;
  listUser: IUserItem[];
  role: IUserItem;
  des?: string;
}
export type TlistGroupsMap<T> = Record<string, T>;
export interface ISidebarSlice {
  listFriends: IFriend[];
  listGroups: TlistGroupsMap<typeMapItem>;
  listRoomGroups: IFriend[];
}

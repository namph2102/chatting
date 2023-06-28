export interface IUserItem {
  status: boolean;
  fullname: string;
  contentWatting?: number;
  avatar: string;
  _id: string | number;
  idRoom: string;
  typechat: "friend" | "group" | "chatbot";
}

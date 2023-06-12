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

import { FC } from "react";
import { IUserItem } from "./user.type";
import UserItem from "./UserItem";

type UserListProps = {
  title: string;
  listUser: IUserItem[];
};
const UserListContainer: FC<UserListProps> = ({ title, listUser }) => {
  return (
    <div>
      <h3 className="my-4  font-bold text-[12px] text-opacity-80">{title}</h3>
      {listUser.length > 0 &&
        listUser.map((user) => <UserItem key={user._id} user={user} />)}
    </div>
  );
};

export default UserListContainer;

import { FC } from "react";
import { BiCog, BiLock, BiLogOutCircle, BiUserCircle } from "react-icons/bi";
import { cn } from "../../servies/utils";
interface ProfileProps {
  username: string;
  fullname: string;
  isOpen: boolean;
}
const Profile: FC<ProfileProps> = ({ username, fullname, isOpen }) => {
  return (
    <div
      id="userDropdown"
      className={cn(
        "z-10 absolute  ease-in duration-100  text-white -top-[250px] lg:left-0  -left-[150px] border-gray-700 border-[1px]  bg-menu  rounded-lg shadow w-48 ",
        isOpen ? "scale-1" : "scale-0"
      )}
    >
      <div className="px-4 py-3 text-sm border-b-[1px] border-primary">
        <div className="capitalize truncate">Tên: {fullname}</div>
        <div className="font-medium truncate">Tài khoản: {username}</div>
      </div>
      <ul className="py-2 text-sm " aria-labelledby="avatarButton">
        <li>
          <a
            href="#"
            className="flex justify-between  px-4 py-2 text-sm hover:bg-aside/30"
          >
            Thông tin <BiUserCircle fontSize="1rem" />
          </a>
        </li>
        <li>
          <a
            href="#"
            className="flex justify-between  px-4 py-2 text-sm hover:bg-aside/30"
          >
            Cài đặt <BiCog fontSize="1rem" />
          </a>
        </li>
        <li>
          <a
            href="#"
            className="flex justify-between  px-4 py-2 text-sm hover:bg-aside/30"
          >
            Đổi mật khẩu <BiLock fontSize="1rem" />
          </a>
        </li>
      </ul>
      <div className="py-1 border-t-[1px] border-primary">
        <a
          href="#"
          className="flex justify-between  px-4 py-2 text-sm hover:bg-aside/30"
        >
          Đăng xuất <BiLogOutCircle fontSize="1rem" />
        </a>
      </div>
    </div>
  );
};

export default Profile;

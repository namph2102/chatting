import { FC } from "react";
import { BiEditAlt, BiExit, BiUserPlus } from "react-icons/bi";
interface SidebarGroupSettingsPrps {
  setIsOpenFromSetting: (item: any) => any;
}
const SidebarGroupSettings: FC<SidebarGroupSettingsPrps> = ({
  setIsOpenFromSetting,
}) => {
  return (
    <>
      <div className="flex justify-center gap-2 mb-3">
        <div
          onClick={() =>
            setIsOpenFromSetting((prev: any) => ({
              ...prev,
              formChangename: true,
            }))
          }
          className="flex justify-center flex-col items-center  cursor-pointer"
        >
          <span className="text-2xl">
            <BiEditAlt />
          </span>
          <span className="text-[10px]">Thay đổi nhóm</span>
        </div>
        <div
          onClick={() =>
            setIsOpenFromSetting((prev: any) => ({ ...prev, formadd: true }))
          }
          className="flex justify-center flex-col items-center cursor-pointer"
        >
          <span className="text-2xl">
            <BiUserPlus />
          </span>
          <span className="text-[10px]">Thêm thành viên</span>
        </div>

        <div
          onClick={() =>
            setIsOpenFromSetting((prev: any) => ({ ...prev, leaveRoom: true }))
          }
          className="flex justify-center flex-col items-center cursor-pointer"
        >
          <span className="text-2xl">
            <BiExit />
          </span>
          <span className="text-[10px]">Rời Nhóm</span>
        </div>
      </div>
    </>
  );
};

export default SidebarGroupSettings;

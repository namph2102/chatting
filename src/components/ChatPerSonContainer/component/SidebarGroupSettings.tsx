import { FC } from "react";
import { BiEditAlt, BiExit, BiLink, BiUserPlus } from "react-icons/bi";
import { ToastNotify } from "../../../servies/utils";
interface SidebarGroupSettingsPrps {
  setIsOpenFromSetting: (item: any) => any;
  idRoom: string | undefined;
}
const SidebarGroupSettings: FC<SidebarGroupSettingsPrps> = ({
  setIsOpenFromSetting,
  idRoom,
}) => {
  const handleCopyGruop = () => {
    const copyText = `${location.origin}/g/${idRoom}`;
    navigator.clipboard.writeText(copyText).then(() => {
      ToastNotify("Copy Thành công đường dẫn tham gia nhóm").success();
    });
  };
  return (
    <>
      <div className="flex justify-center gap-2 mb-3">
        <div
          onClick={handleCopyGruop}
          className="flex justify-center flex-col items-center cursor-pointer"
        >
          <span className="text-2xl">
            <BiLink />
          </span>
          <span className="text-[10px]">Link Nhóm</span>
        </div>
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

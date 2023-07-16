import { FC } from "react";
import { BiEditAlt, BiExit, BiLink, BiUserPlus } from "react-icons/bi";
import { ToastNotify } from "../../../servies/utils";
import { useTranslation } from "react-i18next";
import "../../../servies/translate/contfigTranslate";
interface SidebarGroupSettingsPrps {
  setIsOpenFromSetting: (item: any) => any;
  idRoom: string | undefined;
}
const SidebarGroupSettings: FC<SidebarGroupSettingsPrps> = ({
  setIsOpenFromSetting,
  idRoom,
}) => {
  const { t } = useTranslation();
  const handleCopyGruop = () => {
    const copyText = `${location.origin}/g/${idRoom}`;
    navigator.clipboard.writeText(copyText).then(() => {
      ToastNotify(
        `${t("copy")} ${t("success")} link ${t("join")} ${t("group")} `
      ).success();
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
          <span className="text-[10px]">Link {t("group")}</span>
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
          <span className="text-[10px] capitalize">
            {t("edit")} {t("group")}
          </span>
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
          <span className="text-[10px] capitalize">
            {t("add")} {t("member")}
          </span>
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
          <span className="text-[10px] capitalize">
            {t("leave")} {t("group")}
          </span>
        </div>
      </div>
    </>
  );
};

export default SidebarGroupSettings;

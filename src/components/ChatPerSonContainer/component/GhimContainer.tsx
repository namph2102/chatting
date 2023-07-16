import { BiXCircle } from "react-icons/bi";

import { FC, useEffect, useRef } from "react";
import { ScroolToBottom, cn } from "../../../servies/utils";
import { ChatUserPersonItemProps } from "./ChatUserPersonItem";
import GhimItem from "./GhimItem";
import { sortArrayFollowKey } from "../util";
import { useTranslation } from "react-i18next";
import "../../../servies/translate/contfigTranslate";
interface GhimContainerProps {
  setIsOpenGhim: (isOpen: boolean) => void;
  isOpenGhim: boolean;
  listCooment: ChatUserPersonItemProps[];
  handleactiveOptions: (
    idComment: string | undefined,
    type: string,
    typeChatting: string
  ) => void;
  idBGcolor: string;
}
const GhimContainer: FC<GhimContainerProps> = ({
  setIsOpenGhim,
  isOpenGhim,
  listCooment,
  idBGcolor,
  handleactiveOptions,
}) => {
  const ghimContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ghimContainerRef.current && ScroolToBottom(ghimContainerRef.current, 1000);
  }, [isOpenGhim]);
  const newlistCoomentCover =
    sortArrayFollowKey(listCooment, "updatedAt") || [];
  const { t } = useTranslation();

  return (
    <div
      id={idBGcolor}
      className={cn(
        "sm:max-w-[600px] rounded-2xl lg:max-w-[800px] overflow-y-hidden max-w-[96%] ml-[2%]  lg:min-w-[600px]  sm:min-w-[500px] min-w-[340px]",
        isOpenGhim ? "" : "hidden"
      )}
    >
      <section className="text-center relative">
        <h6 className="sm:text-2xl text-xl  font-medium py-2">{t("ghim")}</h6>
        <button
          onClick={() => setIsOpenGhim(false)}
          className="absolute text-4xl right-1 top-1 hover:text-red-600"
        >
          <BiXCircle />
        </button>
        <hr className="h-0.5 bg-gray-200" />
      </section>
      <section ref={ghimContainerRef} className="overflow-y-auto h-[80vh]">
        {newlistCoomentCover.length > 0 &&
          newlistCoomentCover.map((item) => (
            <GhimItem
              key={item._id}
              {...item}
              handleactiveOptions={handleactiveOptions}
            />
          ))}
        {newlistCoomentCover.length <= 0 && (
          <div className="flex items-center flex-col justify-center h-full">
            <img src="/images/bg_ghim.png" className="w-[200px]" alt="" />
            <h6> {t("ghimNot")}</h6>
            <p className="text-sm text-center px-2 mt-1">{t("ghimNotice")}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default GhimContainer;

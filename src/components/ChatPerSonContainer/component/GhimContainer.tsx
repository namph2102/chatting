import { BiXCircle } from "react-icons/bi";

import { FC, useEffect, useRef } from "react";
import { ScroolToBottom, cn } from "../../../servies/utils";
import { ChatUserPersonItemProps } from "./ChatUserPersonItem";
import GhimItem from "./GhimItem";
interface GhimContainerProps {
  setIsOpenGhim: (isOpen: boolean) => void;
  isOpenGhim: boolean;
  listCooment: ChatUserPersonItemProps[];
  handleactiveOptions: (
    idComment: string | undefined,
    type: string,
    typeChatting: string
  ) => void;
}
const GhimContainer: FC<GhimContainerProps> = ({
  setIsOpenGhim,
  isOpenGhim,
  listCooment,
  handleactiveOptions,
}) => {
  const ghimContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ghimContainerRef.current && ScroolToBottom(ghimContainerRef.current, 200);
  }, [isOpenGhim]);
  const newlistCoomentCover =
    listCooment.sort((a: any, b: any) => {
      const right: any = new Date(a.updatedAt);
      const left: any = new Date(b.updatedAt);

      return right - left;
    }) || [];

  return (
    <div
      className={cn(
        "sm:max-w-[600px] rounded-2xl lg:max-w-[800px] overflow-y-hidden max-w-[340px] lg:min-w-[600px]  sm:min-w-[500px] min-w-[300px] bg-white  text-black",
        isOpenGhim ? "" : "hidden"
      )}
    >
      <section className="text-center relative">
        <h6 className="text-2xl font-medium py-2">Tin nhắn đã Ghim</h6>
        <button
          onClick={() => setIsOpenGhim(false)}
          className="absolute text-3xl right-2 top-0 hover:text-red-600"
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
            <h6>Chưa ghim tin nhắn nào</h6>
            <p className="text-sm text-center px-2 mt-1">
              Tin nhắn đã ghim trong đoạn chat này sẽ hiển thị ở đây
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default GhimContainer;

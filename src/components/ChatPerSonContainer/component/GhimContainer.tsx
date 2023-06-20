import { BiXCircle } from "react-icons/bi";

import { FC } from "react";
import { cn } from "../../../servies/utils";
import { ChatUserPersonItemProps } from "./ChatUserPersonItem";
import GhimItem from "./GhimItem";
interface GhimContainerProps {
  setIsOpenGhim: (isOpen: boolean) => void;
  isOpenGhim: boolean;
  listCooment: ChatUserPersonItemProps[];
}
const GhimContainer: FC<GhimContainerProps> = ({
  setIsOpenGhim,
  isOpenGhim,
  listCooment,
}) => {
  console.log(listCooment);
  return (
    <div
      className={cn(
        "sm:max-w-[600px] h-[80vh] lg:max-w-[800px] max-w-[340px] lg:min-w-[600px]  sm:min-w-[500px] min-w-[300px] bg-white  text-black",
        isOpenGhim ? "" : "hidden"
      )}
    >
      <section className="text-center relative">
        <h6 className="text-base font-bold py-2">Tin nhắn đang Ghim</h6>
        <button
          onClick={() => setIsOpenGhim(false)}
          className="absolute text-3xl right-2 top-0 hover:text-red-600"
        >
          <BiXCircle />
        </button>
        <hr className="h-0.5 bg-gray-500" />
      </section>
      <section className=" pb-4 overflow-y-auto max-h-[80vh] min-h-[50vh] ">
        {listCooment.length > 0 &&
          listCooment.map((item) => <GhimItem key={item._id} {...item} />)}
      </section>
    </div>
  );
};

export default GhimContainer;

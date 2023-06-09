import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { Tooltip } from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import {
  BiHeadphone,
  BiCloud,
  BiCurrentLocation,
  BiDotsHorizontalRounded,
  BiImages,
  BiLinkAlt,
} from "react-icons/bi";
export type TlistSwipper = {
  id: number;
  title: string;
  Icon: IconType;
  type: string;
};
export const listSwipper: TlistSwipper[] = [
  {
    id: 1,
    title: "Ảnh",
    Icon: BiImages,
    type: "img",
  },
  {
    id: 2,
    title: "Youtube",
    Icon: BsYoutube,
    type: "youtube",
  },
  {
    id: 3,
    title: "mp3",
    Icon: BiHeadphone,
    type: "mp3",
  },

  {
    id: 4,
    title: "Thời tiết",
    Icon: BiCloud,
    type: "weather",
  },
  {
    id: 5,
    title: "Tọa Độ",
    Icon: BiCurrentLocation,
    type: "location",
  },
  {
    id: 6,
    title: "File",
    Icon: BiLinkAlt,
    type: "file",
  },
];

import { IconType } from "react-icons/lib";
import { cn, deFaultIconSize } from "../../servies/utils";
import { componentsProps } from "../../styles/componentsProps";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { BsYoutube } from "react-icons/bs";

interface ChatInputOptionsMoreProps {
  handleChoseSeeting: (item: TlistSwipper) => void;
}
const ChatInputOptionsMore: FC<ChatInputOptionsMoreProps> = ({
  handleChoseSeeting,
}) => {
  const { theme } = useSelector((state: RootState) => state.userStore);
  const [iseOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const [isPageInSwiper, setPageinTWipper] = useState<number>(6);
  const handleResize = useCallback(() => {
    const windowWidht = window.innerWidth;
    switch (true) {
      case windowWidht > 1300:
        setPageinTWipper(6);
        break;
      case windowWidht > 1000:
        setPageinTWipper(4);
        break;
      case windowWidht > 900:
        setPageinTWipper(6);
        break;
      case windowWidht > 600:
        setPageinTWipper(4);
        break;
      default:
        setPageinTWipper(3);
        break;
    }
  }, [isPageInSwiper]);
  useEffect(() => {
    handleResize();
    if (typeof window !== "undefined") {
      // setPageinTWipper(window.innerWidth > 1200 ? 6 : 3);
      window.addEventListener("resize", handleResize);
    }
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="relative">
        <Tooltip
          title="More"
          componentsProps={componentsProps}
          arrow
          placement="top"
        >
          <button>
            <BiDotsHorizontalRounded
              onClick={() => {
                setIsOpenMenu(!iseOpenMenu);
              }}
              fontSize={deFaultIconSize}
            />
          </button>
        </Tooltip>
      </div>
      <section
        id={theme.darkmode}
        className={cn(
          "absolute bottom-24 shadow-xl z-10 cursor-grab left-0 right-0 w-full  opacity-90   px-10 py-3",
          iseOpenMenu ? "" : "hidden"
        )}
      >
        <Swiper spaceBetween={50} slidesPerView={isPageInSwiper} autoplay>
          {listSwipper.map((icon) => {
            const IconJSX = icon.Icon;
            return (
              <SwiperSlide
                onClick={() => {
                  handleChoseSeeting(icon), setIsOpenMenu(!iseOpenMenu);
                }}
                key={icon.id}
              >
                <div className="flex cursor-grab flex-col  justify-center items-center gap-y-2">
                  <button className="avatar-title rounded-full w-10 h-10 flex justify-center items-center">
                    <IconJSX
                      className="text-primary "
                      fontSize={deFaultIconSize}
                    />
                  </button>
                  <p className="text-sm">{icon.title}</p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>
    </>
  );
};

export default ChatInputOptionsMore;

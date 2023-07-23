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
    title: "Nhạc",
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
    title: "Translate",
    Icon: BsFiletypeMp3,
    type: "translate",
  },
];

import { IconType } from "react-icons/lib";
import {
  ToastNotify,
  cn,
  deFaultIconSize,
  handleStopPropagation,
} from "../../servies/utils";
import { componentsProps } from "../../styles/componentsProps";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { BsFiletypeMp3, BsYoutube } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import "../../servies/translate/contfigTranslate";

interface ChatInputOptionsMoreProps {
  handleChoseSeeting: (item: TlistSwipper) => void;
  fileCallback?: (file: File) => void;
}
const ChatInputOptionsMore: FC<ChatInputOptionsMoreProps> = ({
  handleChoseSeeting,
  fileCallback,
}) => {
  useEffect(() => {
    document.addEventListener("click", () => {
      setIsOpenMenu(false);
    });
    return () => {
      document.removeEventListener("click", () => {
        setIsOpenMenu(false);
      });
    };
  }, []);
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
        setPageinTWipper(2);
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
  const handleChangefile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (file) {
      const pathLastfile: string = file.name.split(".").pop() || "nohave";

      if (file.size > 1024 * 1000 * 200) {
        ToastNotify(`${t("size")} file > 200Mb!`).success();

        e.target.value = "";
        return;
      } else if (
        !"mp3 mp4 mpeg mpga m4a wav webm flac aac avi mov wmv mkv".includes(
          pathLastfile?.trim()
        )
      ) {
        ToastNotify(
          `Đuôi.${pathLastfile} phải file thuộc loại audio!`
        ).warning();

        e.target.value = "";
        return;
      }

      if (fileCallback) {
        ToastNotify(`Bạn phải chọn đúng ngôn ngữ file đang nói nhé!`).info();
        ToastNotify(`Upload File ${t("success")}!`).success();

        fileCallback(file);
        e.target.value = "";
      }
    }
  };
  const { t } = useTranslation();
  return (
    <>
      <div onClick={handleStopPropagation} className="relative left-0 top-0">
        <Tooltip
          title={t("mandates")}
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
        onClick={handleStopPropagation}
        id={theme.darkmode}
        className={cn(
          "absolute sm:bottom-24 bottom-20  shadow-xl z-10 cursor-grab left-0 right-0 w-full  opacity-90   px-10 py-3",
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
                  <button>
                    <label
                      className="avatar-title rounded-full w-10 h-10 flex justify-center items-center"
                      htmlFor={icon.type}
                    >
                      <IconJSX
                        className="text-primary "
                        fontSize={deFaultIconSize}
                      />
                    </label>
                  </button>

                  <p className="text-sm capitalize">{t(icon.type)}</p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <input
          type="file"
          onInput={handleChangefile}
          id="translate"
          className="hidden"
        />
      </section>
    </>
  );
};

export default ChatInputOptionsMore;

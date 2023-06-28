import { FC, useCallback, useState } from "react";
import {
  BiCaretDown,
  BiCaretLeft,
  BiCaretRight,
  BiCaretUp,
  BiDownload,
  BiRotateLeft,
  BiRotateRight,
  BiXCircle,
  BiZoomIn,
} from "react-icons/bi";

import { Controlled as ControlledZoom } from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { ChatUserPersonItemProps } from "../component/ChatUserPersonItem";
import { HandleTimeDiff, cn } from "../../../servies/utils";
import { nanoid } from "@reduxjs/toolkit";
import { IImageFireBase } from "../component/MyDropzone";

interface ShowImageProps {
  listSidebarcomment: ChatUserPersonItemProps[];
  fullname: string;
  setIsOpenShowImage: (isshow: boolean) => void;
}
interface TInfoImage extends IImageFireBase {
  createdAt: string;
}
interface TInfoImage extends Pick<ChatUserPersonItemProps, "author"> {
  _id: string;
  key: string;
}

const ShowImage: FC<ShowImageProps> = ({
  listSidebarcomment,
  fullname,
  setIsOpenShowImage,
}) => {
  const listImageCover: TInfoImage[] = [];

  listSidebarcomment.map((item) => {
    if (!item.file) return null;
    item.file.map((image) => {
      if (image) {
        listImageCover.push({
          ...image,
          createdAt: item.createdAt,
          author: item.author,
          _id: item._id || "dsadsa",
          key: nanoid(),
        });
      }
    });
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [infoImage, setInfoImage] = useState<TInfoImage>(
    listImageCover[currentIndex]
  );

  const handleChangeIndex = (index: number) => {
    if (index >= listImageCover.length) {
      index = 0;
    } else if (index < 0) {
      index = listImageCover.length - 1;
    }
    setCurrentIndex(index);
    if (listImageCover[index]) {
      setInfoImage(listImageCover[index]);
    }
  };
  const [isZoomed, setIsZoomed] = useState(false);

  const handleZoomChange = useCallback((shouldZoom: boolean) => {
    setIsZoomed(shouldZoom);
  }, []);

  return (
    <section className="fixed h-screen bg-gray-900   inset-0 z-50 ">
      <button
        onClick={() => setIsOpenShowImage(false)}
        className="text-3xl hover:text-red-500 items-end absolute top-2 right-2 z-10"
      >
        <BiXCircle />
      </button>
      <div className="md:flex  block">
        <div className="md:basis-5/6 relative md:min-h-[calc(100vh-100px)] min-h-[calc(60vh)]">
          <h1 className="text-center capitalize text-xl font-bold py-4">
            {fullname}
          </h1>
          <button
            onClick={() => handleChangeIndex(currentIndex - 1)}
            className="absolute text-3xl  top-1/2  -translate-y-1/2 left-4 bg-black/80 p-2 rounded-full hover:opacity-60 "
          >
            <span className="md:block hidden">
              <BiCaretDown />
            </span>
            <span className="md:hidden block">
              <BiCaretLeft />
            </span>
          </button>
          <button
            onClick={() => handleChangeIndex(currentIndex + 1)}
            className="absolute text-3xl  top-1/2  -translate-y-1/2 right-4  bg-black/80 p-2 rounded-full hover:opacity-60 "
          >
            <span className="md:block hidden">
              <BiCaretUp />
            </span>
            <span className="md:hidden block">
              <BiCaretRight />
            </span>
          </button>

          <div className="flex justify-center  items-center">
            <ControlledZoom isZoomed={isZoomed} onZoomChange={handleZoomChange}>
              <img
                className=" md:w-auto md:max-h-[80vh] w-[200px]   object-cover border-2 border-gray-700"
                src={infoImage?.fileName && infoImage?.url}
              />
            </ControlledZoom>
          </div>
        </div>

        <div className="md:basis-1/6   right-0 top-0  flex md:flex-col max-h-screen overflow-hidden mx-4 my-4 flex-row gap-2 md:items-center items-start md:justify-start">
          {listImageCover.map(
            (image, index) =>
              image && (
                <img
                  onClick={() => handleChangeIndex(index)}
                  key={nanoid()}
                  src={image.url}
                  alt="Ảnh lỗi"
                  className={cn(
                    "md:w-28 md:h-28 w-20 h-20 object-cover   rounded-sm cursor-pointer ",
                    index == currentIndex ? "border-4 border-gray-700" : "",
                    currentIndex == index ? `order-first` : `order-none`
                  )}
                />
              )
          )}
        </div>
      </div>
      <div className="flex  fixed bottom-2 left-2 right-4  items-center justify-between">
        <div className="flex  items-center gap-3">
          <img
            src={infoImage.author.avatar}
            className="w-12 h-12 object-cover rounded-full"
            alt=""
          />
          <div>
            <p className="text-base capitalize">{infoImage.author.fullname}</p>
            <p className="text-sm">{HandleTimeDiff(infoImage.createdAt)}</p>
          </div>
        </div>
        <div className="text-3xl w-[200px] flex gap-2">
          <a
            download={infoImage.fileName}
            target="_blank"
            href={infoImage.url}
            className="text-primary-hover"
          >
            <BiDownload />
          </a>
          <button
            onClick={() => handleChangeIndex(currentIndex - 1)}
            className="text-primary-hover"
          >
            <BiRotateLeft />
          </button>
          <button
            onClick={() => handleChangeIndex(currentIndex + 1)}
            className="text-primary-hover"
          >
            <BiRotateRight />
          </button>
          <button onClick={() => handleZoomChange(true)}>
            <BiZoomIn />
          </button>
        </div>
        <span></span>
      </div>
    </section>
  );
};

export default ShowImage;

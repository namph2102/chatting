import { FC, useCallback, useState } from "react";
import { cn } from "../../../servies/utils";
import { Link } from "react-router-dom";
import { BsDownload } from "react-icons/bs";

import { Controlled as ControlledZoom } from "react-medium-image-zoom";
interface ImageCommentProps {
  fileName: string;
  path: string;
  size: number;
  url: string;
}
const ImageComment: FC<{ file: ImageCommentProps }> = ({ file }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleZoomChange = useCallback((shouldZoom: boolean) => {
    setIsZoomed(shouldZoom);
  }, []);

  return (
    <div
      className={cn(
        "relative lg:w-[250px] max-w-[200px] max-h-[200px] bg-black"
      )}
    >
      {!isImageLoaded && (
        <img
          className="w-full  object-cover max-h-[190px] cursor-pointer rounded-md"
          loading="lazy"
          src={"./images/imageloading.gif"}
          alt={file.fileName}
        />
      )}
      <ControlledZoom isZoomed={isZoomed} onZoomChange={handleZoomChange}>
        <img
          className="w-full  object-cover max-h-[190px] cursor-pointer rounded-md"
          loading="lazy"
          src={file.url}
          onLoad={handleImageLoad}
          onError={handleImageLoad}
          alt={file.fileName}
          style={{ display: isImageLoaded ? "block" : "none" }}
        />
      </ControlledZoom>

      <div className="absolute bg-black/60 py-2 bottom-0  left-0 w-full right-0 h-12 flex items-center text-left">
        <img src="images/iconimage.png" className="lg:w-10 w-8" />
        <div className="text-sm text-white  font-normal flex flex-col line-clamp-1  text-ellipsis">
          <span className="line-clamp-1">{file.fileName} </span>
          <span>{file.size.toFixed(2)} kb</span>
        </div>
        <Link
          className="absolute right-4 -bottom-6 animate-bounce text-base font-bold text-primary-hover"
          to={file.url}
          target="_blank"
          download={file.fileName}
        >
          <BsDownload />
        </Link>
      </div>
    </div>
  );
};

export default ImageComment;

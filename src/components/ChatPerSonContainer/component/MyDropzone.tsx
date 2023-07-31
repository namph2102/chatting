import { FC, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import handleImageFirebase from "../util/handleImageFirebase";
import { handleStopPropagation } from "../../../servies/utils";
import { BiCloudUpload, BiXCircle } from "react-icons/bi";
import { nanoid } from "@reduxjs/toolkit";
import { useTranslation } from "react-i18next";
import "../../../servies/translate/contfigTranslate";

interface MyDropzoneProps {
  handleSendMessage: (listImage: any, type: string) => void;
  setIsOpenFile(isOpenFile: boolean): void;
}
export interface IImageFireBase {
  url: string;
  fileName: string;
  path: string;
  size: number;
}

const MyDropzone: FC<MyDropzoneProps> = ({
  handleSendMessage,
  setIsOpenFile,
}) => {
  const { t } = useTranslation();
  const [listImageUrl, setListImageUrl] = useState<string[]>([]);
  const [listImage, setListImage] = useState<IImageFireBase[]>([]);
  const onDrop = useCallback((acceptedFiles: any) => {
    acceptedFiles.forEach(async (file: File) => {
      const reader = new FileReader();
      await handleImageFirebase
        .uploadimage("chats", file)
        .then((image: IImageFireBase | any) => {
          image && setListImage((prev) => [...prev, image]);
        });
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Convert ArrayBuffer to Blob
        const arrayBuffer: any = reader.result;
        if (!arrayBuffer) return;
        const blob = new Blob([arrayBuffer], { type: file.type });

        // Create URL for the image
        const imageUrl = URL.createObjectURL(blob);

        setListImageUrl((prev) => [...prev, imageUrl]);
      };

      reader.readAsArrayBuffer(file);
    });
  }, []);
  useEffect(() => {
    return () => {
      setListImage([]);
      setListImageUrl((prev: string[]) => {
        prev.map((url) => URL.revokeObjectURL(url));
        return [];
      });
    };
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const handleChangeSelect = () => {
    listImage.map((fileImage) =>
      handleImageFirebase.deleteImage(fileImage.path)
    );
    setListImage([]);
    setListImageUrl([]);
  };

  return (
    <>
      <button
        className="text-red-500"
        onClick={() => {
          setIsOpenFile(false), handleChangeSelect();
        }}
      >
        <BiXCircle className="text-3xl absolute -top-6 -right-6" />
      </button>

      <div
        onClick={handleStopPropagation}
        className="min-w-[250px] min-h-[250px] sm:min-w-[400px] sm:min-h-[400px] border-2 border-white flex justify-center items-center border-dotted"
        {...getRootProps()}
      >
        <input id="uploadfile" {...getInputProps()} />
        <p className="py-2 flex flex-col justify-center items-center cursor-pointer">
          <BiCloudUpload className="text-6xl text-primary" />
          <span>
            {t("drop")} {t("or")} {t("drag")} {t("img")} {t("here")}
          </span>
        </p>
        {listImageUrl.length >= 2 && (
          <div className="absolute inset-0  w-full bg-black flex gap-2 flex-wrap ">
            {listImageUrl.map((url) => (
              <img
                key={nanoid()}
                className="object-cover max-w-[200px] max-h-[150px]"
                src={url}
                alt="error"
              />
            ))}
          </div>
        )}
        {listImageUrl.length == 1 &&
          listImageUrl.map((url) => (
            <img
              key={nanoid()}
              className="absolute inset-0 w-full  h-full"
              src={url}
              alt="error iamge"
            />
          ))}
        <div className="absolute top-full flex gap-2 text-sm mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSendMessage(listImage, "image");
              setListImage([]);
              setIsOpenFile(false);
            }}
            className="background-primary-hover py-2 px-4 bg-green-700 rounded-full capitalize"
          >
            {t("accept")}
          </button>
          <button
            onClick={handleChangeSelect}
            className="hover:opacity-75 py-2 px-4 bg-red-700 rounded-full capitalize "
          >
            {t("change")}
          </button>
        </div>
      </div>
    </>
  );
};

export default MyDropzone;

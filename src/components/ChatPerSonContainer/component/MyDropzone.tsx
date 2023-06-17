import { FC, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import handleImageFirebase from "../util/handleImageFirebase";
import { handleStopPropagation } from "../../../servies/utils";
import { BiCloudUpload } from "react-icons/bi";
import { nanoid } from "@reduxjs/toolkit";
interface MyDropzoneProps {
  handleSendMessage: (listImage: any, type: string) => void;
}
const listImage = [];
const MyDropzone: FC<MyDropzoneProps> = ({ handleSendMessage }) => {
  console.log("********************************");

  console.log("********************************");
  const [listImageUrl, setListImageUrl] = useState<string[]>([]);
  const onDrop = useCallback((acceptedFiles: any) => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();
      handleImageFirebase.uploadimage("chats", file).then((res) => {
        console.log(res);
        listImage.push(res);
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
        console.log(listImageUrl);
        setListImageUrl((prev) => [...prev, imageUrl]);
      };

      reader.readAsArrayBuffer(file);
    });
  }, []);
  useEffect(() => {
    return () => {
      setListImageUrl((prev: string[]) => {
        prev.map((url) => URL.revokeObjectURL(url));
        return [];
      });
    };
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      onClick={handleStopPropagation}
      className="min-w-[250px] min-h-[250px] sm:min-w-[400px] sm:min-h-[400px] border-2 border-white flex justify-center items-center border-dotted"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <p className="py-2 flex flex-col justify-center items-center cursor-pointer">
        <BiCloudUpload className="text-6xl text-primary" />
        <span>Kéo hoặc thả ảnh vào đây</span>
      </p>
      {listImageUrl.length > 2 && (
        <div className="absolute inset-0 bottom-10 w-full h-40 grid grid-cols-2 gap-2">
          {listImageUrl.map((url) => (
            <img key={nanoid()} className="object-cover" src={url} alt="" />
          ))}
        </div>
      )}
      {listImageUrl.length == 1 &&
        listImageUrl.map((url) => (
          <img
            key={nanoid()}
            className="absolute inset-0 w-full h-full"
            src={url}
            alt=""
          />
        ))}
      <div className="absolute top-full flex gap-2 text-sm mt-2">
        <button
          onClick={(e) => {
            e.stopPropagation(), handleSendMessage(listImageUrl, "image");
          }}
          className="background-primary-hover py-2 px-4 bg-green-700 rounded-full"
        >
          Chấp nhận
        </button>
        <button
          onClick={() => setListImageUrl([])}
          className="hover:opacity-75 py-2 px-4 bg-red-700 rounded-full "
        >
          Thay đổi
        </button>
      </div>
    </div>
  );
};

export default MyDropzone;

import { FC, useState } from "react";
import ModalProviderOverlay from "../../Ui/ModalProviderOverlay";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import { BiCloudUpload, BiX } from "react-icons/bi";
import { useFormik } from "formik";
import * as yup from "yup";
import { ToastNotify, cn } from "../../../servies/utils";
import handleImageFirebase from "../util/handleImageFirebase";
import { IImageFireBase } from "./MyDropzone";
import { LoaddingOverLay } from "../../loading";
import { HandleCoverStringEntries } from "../../chatContainer/chat.utils";
import instance from "../../../config";
import { socket } from "../ChatPerSonContainer";
import { PserSonChating } from "../../../redux/Slice/ChatPersonSlice";
import { useTranslation } from "react-i18next";
import "../../../servies/translate/contfigTranslate";
interface SidebarChangeInfoGroupProps {
  theme: {
    backgroundthem: string;
    darkmode: string;
    primaryColor: string;
  };
  person: PserSonChating;

  idAccount: string;
  setIsOpenFromSetting: (item: any) => any;
}
const SidebarChangeInfoGroup: FC<SidebarChangeInfoGroupProps> = ({
  setIsOpenFromSetting,
  theme,
  person,
  idAccount,
}) => {
  const { t } = useTranslation();
  const handleClose = () => {
    setIsOpenFromSetting((prev: any) => ({ ...prev, formChangename: false }));
  };

  const formik = useFormik({
    initialValues: {
      name: person.fullname,
      des: "",
    },
    validationSchema: yup.object().shape({
      name: yup
        .string()
        .required()
        .max(100, `${t("name")} ${t("inputExceed")} 100 ${t("character")}`),
      des: yup.string(),
    }),
    onSubmit: async (data) => {
      setIsLoadding(true);
      try {
        let url = person.avatar,
          path = "";

        const newName = HandleCoverStringEntries(data.name);
        const desGroup = HandleCoverStringEntries(data.des);
        if (fileImage) {
          const res: IImageFireBase = await handleImageFirebase
            .uploadimage("chats", fileImage)
            .then((image: IImageFireBase | any) => {
              return image;
            });
          if (res?.path) {
            url = res.url;
            path = res.path;
          }
        }

        const dataChange = {
          url,
          path,
          name: newName,
          des: desGroup,
          room: person.idRoom,
          idSend: idAccount,
        };
        instance
          .patch("room/update/settings", { data: dataChange })
          .then((res) => res.data)
          .then(async (data) => {
            if (data.message) {
              ToastNotify(data.message).success();
              if (url && path) {
                if (data?.resultRoom) {
                  if (data?.resultRoom?.avatar?.path) {
                    await handleImageFirebase.deleteImage(
                      data.resultRoom.avatar.path
                    );
                  }
                }
              }
              socket.emit("loading-room-setting", {
                idRoom: person.idRoom,
                fullname: newName,
                url: url,
              });
              handleClose();
            }
          })
          .finally(() => {
            setIsLoadding(false);
            formik.resetForm();
          });
      } catch (err) {
        setIsLoadding(false);
      }
    },
  });
  const [fileImage, setFileImage] = useState<File>();
  const [ImageUrl, setImageUrl] = useState("");
  const handleChangeImage = (file: File) => {
    // Check if the file is an image
    if (file && file.type.startsWith("image/")) {
      if (ImageUrl) URL.revokeObjectURL(ImageUrl);
      const blogImage = URL.createObjectURL(file);
      if (blogImage) {
        setImageUrl(blogImage);
        setFileImage(file);
      }
    } else {
      ToastNotify("Đây không phải là ảnh ?").error();
    }
  };
  const [isLoadding, setIsLoadding] = useState(false);
  return (
    <ModalProviderOverlay setIsCloseModal={handleClose}>
      <div
        id={theme.darkmode}
        className="sm:w-[600px] w-full min-w-[320px]  p-2 rounded-xl"
      >
        <section className="flex justify-between px-2 relative items-center pt-1 pb-4">
          <h5 className="text-xl my-2 text-center w-full">
            <span className="capitalize">
              {t("edit")} {t("group")}
            </span>{" "}
            "{person.fullname}"
          </h5>
          <button
            onClick={handleClose}
            className="text-3xl absolute md:top-2 md;right-2 top-0 right-0"
          >
            <BiX />
          </button>
        </section>
        <form method="POST" onSubmit={formik.handleSubmit}>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3 ">
              <label
                className="block uppercase tracking-wide text-xs font-bold mb-2"
                htmlFor="group-name"
              >
                {t("edit")} {t("name")}
              </label>
              <input
                type="text"
                name="name"
                className="flex-1 border-none outline-0 form-control text-sm w-full py-2 px-4 rounded-xl"
                placeholder={`${t("type")} ${t("name")} ${t("group")}...`}
                required
                value={formik.values.name}
                onChange={formik.handleChange}
                maxLength={100}
              />
            </div>
          </div>

          <div className="flex flex-wrap -mx-3">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-xs font-bold mb-2"
                htmlFor="des-group"
              >
                {t("des")} {t("group")}
              </label>

              <TextareaAutosize
                id="des-group"
                placeholder={`${t("des")} ${t("group")}`}
                name="des"
                className=" appearance-none form-control block w-full text-sm  rounded py-3 px-2 mb-3 leading-tight focus:outline-none"
                maxRows={5}
                minRows={3}
                value={formik.values.des}
                onChange={formik.handleChange}
                maxLength={600}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full px-3">
              <div className="block uppercase tracking-wide text-xs font-bold mb-2">
                {t("img")} {t("group")}
              </div>
              <label htmlFor="image-group" className="relative">
                <div className="w-28 h-28 border-dashed flex flex-col border-primary_style-document  justify-center items-center">
                  <span className="text-2xl">
                    <BiCloudUpload />
                  </span>
                  <p className="text-sm capitalize">{t("change")}</p>
                </div>
                {ImageUrl && (
                  <img
                    src={ImageUrl}
                    className="absolute inset-0 w-28 h-28"
                    alt="ảnh lỗi"
                  />
                )}
              </label>
              <input
                onChange={(e: any) => {
                  e?.target?.files[0] && handleChangeImage(e.target.files[0]);
                }}
                id="image-group"
                type="file"
                className="hidden"
              />
            </div>
          </div>

          <div className="w-full flex justify-center">
            <button
              disabled={!!formik.errors?.name}
              className={cn(
                "py-2 px-5 background-primary-hover  w-[90%] md:w-[200px] capitalize background-primary rounded-xl",
                formik.errors?.name ? "opacity-50" : "opacity-100"
              )}
              type="submit"
            >
              {t("send")}
            </button>
          </div>
        </form>
        {isLoadding && <LoaddingOverLay />}
      </div>
    </ModalProviderOverlay>
  );
};

export default SidebarChangeInfoGroup;

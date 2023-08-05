import { BiPencil, BiUser, BiXCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux";
import ModalProviderOverlay from "../../components/Ui/ModalProviderOverlay";

import InputElement from "../../components/form/InputElement";
import { useFormik } from "formik";
import * as Yup from "yup";
import { socket } from "../../components/ChatPerSonContainer/ChatPerSonContainer";
import { CapitalizeString, ToastNotify, cn } from "../../servies/utils";
import { useState } from "react";
import { updateFieldAccount } from "../../redux/Slice/AccountSlice";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import "../../servies/translate/contfigTranslate";
import { useTranslation } from "react-i18next";
const regexPhoneNumber=(phone:string) => {

  const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

  return phone.match(regexPhoneNumber) ? true : false;

}

const PersonInfo = () => {
  const { t } = useTranslation();
  const { account } = useSelector((state: RootState) => state.userStore);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      fullname: CapitalizeString(account.fullname),
      email: account.email,
      address: account.address,
      phone: account.phone || "",
    },
    validationSchema: Yup.object().shape({
      fullname: Yup.string()
        .required(t("inputRequired"))
        .matches(
          /^[\D \s]+$/,
          `${t("only")} ${t("includes")} "${t("alphabet")}"`
        )
        .min(2, `${t("minis")} 2 ${t("character")}`)
        .max(50, `${t("inputExceed")} 50 ${t("character")}`),
      email: Yup.string()
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, `${t("not")} ${t("format")}`)
        .max(100, `${t("inputExceed")} 100 ${t("character")}`),
      phone: Yup.string().max(12, `${t("inputExceed")} 11 ${t("character")}`),
    }),
    onSubmit(values) {
      if(values.phone){
          if(!regexPhoneNumber(values.phone)){
            ToastNotify(`${t("phone")} ${t("notfaild")}   ${t("format")}`).error();        
                return;
          }
      }
      if (!account._id) return;
      socket.emit("user-change-info-profile", {
        ...values,
        listFriend: account.friends,
      });

      dispatch(updateFieldAccount(values));
      setIsOpenModal(false);
    },
  });
  const [isOpenMore, setIsOpenMore] = useState(false);
  return (
    <>
      <li
        onClick={() => setIsOpenMore(!isOpenMore)}
        className="flex justify-between border-t-[0.5px] border-[#666666]  p-2 mt-4 cursor-pointer"
      >
        <div className="flex gap-2 items-center ">
          <span>
            <BiUser />
          </span>
          <span>{t("profile")}</span>
        </div>
        <button className="text-3xl">
          {!isOpenMore ? <RiArrowDropDownLine /> : <RiArrowDropUpLine />}
        </button>
      </li>
      <ul
        className={cn(
          "pl-2 relative text-sm gap-2 flex flex-col",
          isOpenMore ? "h-auto mb-3" : "h-0 overflow-hidden"
        )}
      >
        <button
          onClick={() => setIsOpenModal(!isOpenModal)}
          type="button"
          className="absolute right-0 top-2 w-8 h-8 flex justify-center items-center rounded-full background-primary opacity-80  hover:opacity-100"
        >
          <BiPencil />
        </button>
        <li>
          <p className="opacity-80">{t("fullname")}</p>
          <p className="mt-1 font-semibold capitalize text-xs">
            {account.fullname || `${t("not")} ${t("update")}`}
          </p>
        </li>
        <li>
          <p className="opacity-80">{t("phone")}</p>
          <p className="mt-1 font-semibold capitalize text-xs">
            {!account.phone
              ? `${t("not")} ${t("update")}`
              : `${account.phone}`}
          </p>
        </li>
        <li>
          <p className="opacity-80">Email</p>
          <p className="mt-1 font-semibold text-xs">
            {account.email || `${t("not")} ${t("update")}`}
          </p>
        </li>
        <li>
          <p className="opacity-80">{t("address")}</p>
          <p className="mt-1 font-semibold capitalize text-xs">
            {account.address}
          </p>
        </li>
      </ul>
      {isOpenModal && (
        <ModalProviderOverlay setIsCloseModal={() => setIsOpenModal(false)}>
          <form
            onSubmit={formik.handleSubmit}
            className="py-4 px-4 rounded-xl sm:w-auto w-full flex flex-col bg-white relative text-black"
          >
            <h6 className="font-bold text-xl text-center my-2">
              {t("change")} {t("info")}
            </h6>
            <button
              onClick={() => setIsOpenModal(false)}
              className="text-3xl absolute top-2 right-2 text-primary-hover"
            >
              <BiXCircle />
            </button>
            <InputElement
              name="fullname"
              error={formik.errors.fullname}
              value={formik.values.fullname}
              handleChange={formik.handleChange}
              title={t("fullname")}
            />
            <InputElement
              name="phone"
              error={formik.errors.phone}
              value={formik.values.phone}
              handleChange={formik.handleChange}
              title={t("phone")}
            />
            <InputElement
              name="email"
              error={formik.errors.email}
              value={formik.values.email}
              handleChange={formik.handleChange}
              title="email"
            />
            <InputElement
              name="address"
              value={formik.values.address}
              handleChange={formik.handleChange}
              title={t("address")}
            />
            <button
              type="submit"
              className="background-primary background-primary-hover opacity-90 hover:opacity-100 py-2 rounded-xl"
            >
              {t("update")}
            </button>
          </form>
        </ModalProviderOverlay>
      )}
    </>
  );
};

export default PersonInfo;

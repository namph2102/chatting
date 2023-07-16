import { cn } from "../../servies/utils";
import { Tooltip } from "@mui/material";
import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import "../../servies/translate/contfigTranslate";
interface InputElementprops {
  title: string;
  error?: string;
  value: string;
  handleChange: (e: React.ChangeEvent<unknown>) => void;
  name: string;
  isPassword?: boolean;
}
const InputElement: FC<InputElementprops> = ({
  error = "",
  title,
  name,
  value,
  isPassword,
  handleChange,
}) => {
  const [isShowEye, setShowEye] = useState<boolean>(false);
  const [isShowError, setShowError] = useState<boolean>(false);
  const { t } = useTranslation();

  return (
    <div className="sm:w-[350px] w-full relative">
      <label
        htmlFor={name}
        className="block text-transparent/70 capitalize text-sm mb-1 font-semibold  border-none outline-none"
      >
        {title}:
      </label>
      <input
        type={!isPassword ? "text" : isShowEye ? "text" : "password"}
        id={name}
        name={name}
        required
        autoComplete="off"
        className={cn(
          " w-full border border-gray-400 bg-white mt-1 outline-none  py-2 px-3 text-transparent/80 text-sm rounded-lg",
          isShowError && error ? "border border-red-500" : ""
        )}
        placeholder={`${t("type")} ${title}`}
        value={value}
        onChange={handleChange}
        onBlur={() => value && setShowError(true)}
        onInput={() => setShowError(false)}
      />
      {isPassword && (
        <Tooltip
          title={(isShowEye ? t("show") : t("hidden")) + " " + t("content")}
          arrow
          placement="top"
        >
          <div
            onClick={() => setShowEye(!isShowEye)}
            className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 mt-0.5"
          >
            {isShowEye ? (
              <BsFillEyeFill fill="#001" />
            ) : (
              <BsFillEyeSlashFill fill="#001" />
            )}
          </div>
        </Tooltip>
      )}

      <p className="text-red-500 mt-1 min-h-[14px] text-xs font-semibold ">
        {isShowError && error && (
          <>
            <span className="capitalize"> {title} </span> <span> {error}</span>
          </>
        )}
      </p>
    </div>
  );
};

export default React.memo(InputElement);

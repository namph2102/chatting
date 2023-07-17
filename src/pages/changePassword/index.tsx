import InputElement from "../../components/form/InputElement";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet";
import { CapitalizeString, ToastNotify } from "../../servies/utils";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsFillChatSquareTextFill } from "react-icons/bs";
import { LoaddingOverLay } from "../../components/loading";

import instance from "../../config";
import { useTranslation } from "react-i18next";
import "../../servies/translate/contfigTranslate";
const ChangePassword = () => {
  const navigate = useNavigate();

  const aboutController = new AbortController();

  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      aboutController.abort();
    };
  }, []);

  const [isLoading, setIsloading] = useState<boolean>(false);
  const formik: any = useFormik({
    initialValues: {
      password: "",
      username: "",
      newpassword: "",
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .required(t("inputRequired"))
        .max(50, `${t("inputExceed")}  50 ${t("character")}`),

      newpassword: Yup.string()
        .required(t("inputRequired"))
        .max(50, `${t("inputExceed")}  50 ${t("character")}`),
      username: Yup.string()
        .required(t("inputRequired"))
        .max(50, `${t("inputExceed")}  50 ${t("character")}`),
    }),
    onSubmit: async (objvalue) => {
      if (objvalue.password == objvalue.newpassword) {
        ToastNotify("Mật khẩu mới bị trùng!").error();
        return;
      }
      const data = {
        username: objvalue.username.trim(),
        password: objvalue.password.trim(),
        newpassword: objvalue.newpassword.trim(),
      };
      setIsloading(true);
      instance
        .post("user/changepassword", {
          data,
        })
        .then((res) => res.data)
        .then(
          ({
            statusCode,
            message,
          }: {
            statusCode: number;
            message: string;
          }) => {
            if (statusCode == 201) {
              ToastNotify(message).success();
              navigate("/");
            } else {
              ToastNotify(message).error();
            }
          }
        )
        .finally(() => {
          setIsloading(false);
        });
    },
  });

  return (
    <section id="register" className="overflow-y-auto relative">
      <Helmet>
        <title>
          {CapitalizeString(t("change")) + " " + t("password") + t("home")}{" "}
          Zecky
        </title>
      </Helmet>
      <div className="py-6 container mx-auto px-2 flex flex-wrap h-screen ">
        <article className="lg:basis-1/4 basis-full lg:text-left text-center">
          <div className="flex items-end lg:justify-start justify-center gap-3">
            <BsFillChatSquareTextFill fontSize="1.5rem" />
            <h1 className="font-semibold text-2xl ">
              <Link to="/">Zecky</Link>
            </h1>
          </div>
          <div className="text-base lg:text-left lg:mb-0 mb-8 text-center mt-2 grid place-items-center">
            <div className="typing-demo min-h-[16px]">
              {t("welcomeToMywebsite")}{" "}
              <b className=" font-semibold ">
                <Link to="/">Zecky!</Link>
              </b>
            </div>
          </div>
        </article>
        <article
          id="light-mode"
          className="lg:basis-3/4 basis-full flex flex-col items-center justify-center rounded-xl py-6 px-2"
        >
          <div className="text-center mb-6">
            <h2 className="font-bold text-3xl capitalize">
              {t("change")} {t("password")}
            </h2>
            <p className="text-sm mt-3 text-transparent/60">
              {t("letChatWithFriends")}
              <Link to="/">
                {" "}
                <span className="text-primary font-bold">{t("home")}</span>
              </Link>
            </p>
          </div>

          <form method="POST" onSubmit={formik.handleSubmit}>
            <div className="grid gap-2 mb-1 md:grid-cols-1">
              <InputElement
                name="username"
                error={formik.errors.username}
                value={formik.values.username}
                handleChange={formik.handleChange}
                title={t("username")}
              />
              <InputElement
                name="password"
                error={formik.errors.password}
                value={formik.values.password}
                handleChange={formik.handleChange}
                isPassword={true}
                title={`${t("password")} ${t("old")} `}
              />
              <InputElement
                name="newpassword"
                error={formik.errors.newpassword}
                value={formik.values.newpassword}
                handleChange={formik.handleChange}
                isPassword={true}
                title={`${t("password")} ${t("new")}`}
              />
            </div>

            <p className="text-sm text-center">
              {t("acceptMyTerm")}{" "}
              <a target="_blank" href="https://blog.zecky.online/">
                <strong className="text-primary">Terms of Use</strong>
              </a>
            </p>
            <button
              type="submit"
              className="py-2 capitalize w-full my-3 text-base text-[#fff] background-primary hover:opacity-95 rounded-lg"
            >
              {t("change")}
            </button>
          </form>
          <p className="my-10">
            {t("dontAccount")} ?
            <Link to="/dang-nhap" className="text-primary ml-2">
              {t("login") + " " + t("now")}
            </Link>
          </p>
          <p className="text-sm text-primay opacity-75 pt-4 px-2">
            &copy;{" "}
            <Link to="/">
              <span className="cursor-pointer">Zecky</span>
            </Link>
            .{t("created")} <span className="text-red-600">❤️</span>{" "}
            <a
              href="https://www.facebook.com/namhoai2102"
              target="_blank"
              className="mx-1 text-primary"
            >
              {" "}
              Hoài Nam
            </a>
            Developer
          </p>
        </article>
      </div>
      <figure className="absolute bottom-0 left-[20px] lg:block hidden">
        <img
          src="/theme/bg-login.png"
          alt="Bg-Login"
          width="500"
          height="400"
          loading="lazy"
          className="object-cover"
        />
      </figure>
      {isLoading && <LoaddingOverLay />}
    </section>
  );
};

export default ChangePassword;

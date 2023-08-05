import InputElement from "../../components/form/InputElement";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet";
import {
  ToastNotify,
  customeValue,
  sendEmailRegister,
} from "../../servies/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BsFacebook,
  BsFillChatSquareTextFill,
  BsGithub,
  BsGoogle,
} from "react-icons/bs";
import { LoaddingOverLay } from "../../components/loading";
import { useDispatch } from "react-redux";
import { CreateAccount } from "../../redux/Slice/AccountSlice";
import { AppDispatch } from "../../redux";
import Authentication from "../../config/auth";
import { useTranslation } from "react-i18next";
import "../../servies/translate/contfigTranslate";
const Register = () => {

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const aboutController = new AbortController();
  const signal = aboutController.signal;
  const { t } = useTranslation();
  useEffect(() => {
    return () => {
      aboutController.abort();
    };
  }, []);
    const buttonRef=useRef<HTMLButtonElement>(null)
  const [isLoading, setIsloading] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      avatar: "/images/defaultlavata.png",
      fullname: "",
      password: "",
      username: "",
      uid: "",
    },
    validationSchema: Yup.object().shape({
      fullname: Yup.string()
        .required(t("inputRequired"))
        .matches(
          /^[\D \s]+$/,
          `${t("only")} ${t("includes")} "${t("alphabet")}"`
        )
        .min(2, `${t("minis")} 2 ${t("character")}`)
        .max(50, `${t("inputExceed")}  50 ${t("character")}`),
      password: Yup.string()
        .required(t("inputRequired"))
        .min(5, `${t("minis")} 5 ${t("character")}`)
        .max(50, `${t("inputExceed")}  50 ${t("character")}`),
      username: Yup.string()
        .matches(
          /^[a-zA-Z0-9@.]+$/,
          `${t("includes")} "${t("number")}" , "${t("alphabet")}" ${t(
            "and"
          )} ${t("nothave")} "${t("space")}"`
        )
        .required(t("inputRequired"))
        .min(3, `${t("minis")} 3 ${t("character")}`)
        .max(50, `${t("inputExceed")}  50 ${t("character")}`),
    }),
    onSubmit: async (objvalue) => {
      const data = {
        username: objvalue.username.trim(),
        fullname: customeValue(objvalue.fullname),
        password: objvalue.password.trim(),
        avatar: objvalue.avatar,
        uid: objvalue.uid.trim(),
      };
      if (data.username.includes("@")) {
        sendEmailRegister(data.username, data.fullname);
      }
      setIsloading(true);
      dispatch(CreateAccount(data, signal))
        .then(() => {
          ToastNotify(`${t("register")} ${t("success")} !`).success();
          formik.resetForm();
          navigate("/");
        })
        .catch((err) => {
          ToastNotify(t("account") + " " + err.message).warning();
          formik.setFieldError("username", err.message);
        })
        .finally(() => {
          const idSettimeout = setTimeout(() => {
            setIsloading(false);
            clearTimeout(idSettimeout);
          }, 2000);
        });
    },
  });
  const responsiveLoggin = useCallback(
    (response: {
      user: {
        displayName: string;
        phoneNumber: number;
        photoURL: string;
        email: string;
        uid: string;
      };
    }) => {
    
      if (!response?.user || !response.user.uid) return;
     
    const userID=response.user.uid.slice(1,6);
     formik.setFieldValue("username", response.user.email || userID);
     
      if (response.user.photoURL) {
        formik.setFieldValue("avatar", response.user.photoURL);
      }
      if (response.user.uid) {
        formik.setFieldValue("uid", response.user.uid);
      }
      if (response.user.displayName) {
        formik.setFieldValue("fullname", response.user.displayName || "Người lạ mặt");
      }
      formik.setFieldValue("password", userID);
      if(formik.values.uid && userID && buttonRef.current){
        buttonRef.current.click();
      
      }
    },
    []
  );
  return (
    <section id="register" className="overflow-y-auto relative">
      <Helmet>
        <title>
          {t("register")} {t("member")} Zecky
        </title>
      </Helmet>
      <div className="py-6 container mx-auto px-2 flex flex-wrap h-screen ">
        <article className="lg:basis-1/4 basis-full lg:text-left text-center">
          <div className="flex items-end lg:justify-start justify-center gap-3">
            <BsFillChatSquareTextFill fontSize="1.5rem" />
            <h1 className="font-semibold text-2xl ">
              {" "}
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
            <h2 className="font-bold text-3xl">{t("register")}</h2>
            <p className="text-sm mt-3 text-transparent/60">
              {t("registerDes")}
            </p>
          </div>

          <form method="POST" onSubmit={formik.handleSubmit}>
            <div className="grid gap-2 mb-1 md:grid-cols-1">
              <InputElement
                name="fullname"
                error={formik.errors.fullname}
                value={formik.values.fullname}
                handleChange={formik.handleChange}
                title={t("fullname")}
              />

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
                title={t("password")}
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
              ref={buttonRef}
              className="py-2 w-full my-3 text-base text-[#fff] background-primary hover:opacity-95 rounded-lg"
            >
              {t("register") + " " + t("now")}
            </button>
            <p className="text-center mb-2">{t("cantUse")}</p>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => Authentication.signGoogle(responsiveLoggin)}
                type="button"
                className="py-4 rounded-xl bg-slate-200 hover:bg-slate-300 flex justify-center"
              >
                <BsGoogle fill="#EF476F" className="sm:text-base text-sm" />
              </button>
              <button
                type="button"
                onClick={() => Authentication.signFacebook(responsiveLoggin)}
                className="py-4 rounded-xl bg-slate-200 hover:bg-slate-300 flex justify-center"
              >
                <BsFacebook fill="#560BAD" className="sm:text-base text-sm" />
              </button>

              <button
                onClick={() => Authentication.signGithub(responsiveLoggin)}
                type="button"
                className="py-4 rounded-xl bg-slate-200 hover:bg-slate-300 flex justify-center"
              >
                <BsGithub fill="#000" className="sm:text-base text-sm" />
              </button>
            </div>
          </form>
          <p className="my-10">
            {t("haveAccount")}?{" "}
            <Link to="/dang-nhap" className="text-primary">
              {t("login")}
            </Link>
          </p>
          <p className="text-sm text-primay opacity-75 pt-4 px-2">
            &copy; Zecky. {t("created")}{" "}
            <span className="text-red-600">❤️</span>{" "}
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

export default Register;

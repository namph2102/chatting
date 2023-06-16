import InputElement from "../../components/form/InputElement";
import { useFormik } from "formik";
import * as Yup from "yup";

import { ToastNotify } from "../../servies/utils";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BsFacebook,
  BsFillChatSquareTextFill,
  BsGithub,
  BsGoogle,
} from "react-icons/bs";
import { LoaddingOverLay } from "../../components/loading";
import { useDispatch } from "react-redux";
import {
  LoginAccount,
  uploadFullAccount,
} from "../../redux/Slice/AccountSlice";
import { AppDispatch } from "../../redux";
import Authentication from "../../config/auth";
import instance from "../../config";
const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const aboutController = new AbortController();
  const signal = aboutController.signal;
  useEffect(() => {
    document.title = "Đăng ký tại Zecky";

    return () => {
      aboutController.abort();
    };
  }, []);
  const responsiveLoggin = useCallback(
    (response: {
      user: {
        uid: string;
        email: string;
      };
    }) => {
      if (!response?.user) return;
      setIsloading(true);
      if (response?.user?.uid) {
        instance
          .post("user/login/firebase", {
            data: {
              uid: response.user.uid,
              username:
                response?.user?.email || localStorage.getItem("username"),
            },
          })
          .then((res) => {
            if (res.data?.account) {
              uploadFullAccount(dispatch, res.data?.account);

              const idTimeout = setTimeout(() => {
                setIsloading(false);

                clearTimeout(idTimeout);
                navigate("/");
              }, 2000);
              return;
            } else {
              ToastNotify("Sever đang bị lỗi!").info();
            }
          })
          .catch((err) => {
            setIsloading(false);
            const message =
              err?.response?.data?.message || "Tài khoản chưa đăng ký";
            ToastNotify(message).error();
          });
      }
    },
    []
  );
  const [isLoading, setIsloading] = useState<boolean>(false);
  const formik: any = useFormik({
    initialValues: {
      password: "",
      username: "",
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .required("không được để trống")
        .max(50, "không vượt vượt quá 50 ký tự"),
      username: Yup.string()
        .required("không được để trống")
        .max(50, "không vượt vượt quá 50 ký tự"),
    }),
    onSubmit: async (objvalue) => {
      const data = {
        username: objvalue.username.trim(),
        password: objvalue.password.trim(),
      };
      setIsloading(true);
      const isRedis = await dispatch(LoginAccount({ ...data }, signal)).finally(
        () => {
          setIsloading(false);
        }
      );
      if (isRedis) {
        ToastNotify("Đăng nhập thành công!").success();
        navigate("/");
      }
    },
  });

  return (
    <section id="register" className="overflow-y-auto relative">
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
              Chào bạn đã đến với{" "}
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
            <h2 className="font-bold text-3xl">Đăng nhập</h2>
            <p className="text-sm mt-3 text-transparent/60">
              Cùng trò chuyện với bạn bè nào{" "}
              <Link to="/">
                {" "}
                <span className="text-primary font-bold">Trang chủ</span>
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
                title="tài khoản"
              />
              <InputElement
                name="password"
                error={formik.errors.password}
                value={formik.values.password}
                handleChange={formik.handleChange}
                isPassword={true}
                title="mật khẩu"
              />
            </div>

            <p className="text-sm text-center">
              Chấp nhận chính sách của tôi{" "}
              <Link to="/chinh-sach">
                <strong className="text-primary">Terms of Use</strong>
              </Link>
            </p>
            <button
              type="submit"
              className="py-2 w-full my-3 text-base text-[#fff] background-primary hover:opacity-95 rounded-lg"
            >
              Đăng nhập ngay
            </button>
            <p className="text-center mb-2">Có thể sử dụng với</p>
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
            Bạn chưa có tài khoản ?
            <Link to="/dang-ky" className="text-primary ml-2">
              Đăng ký ngay
            </Link>
          </p>
          <p className="text-sm text-primay opacity-75 pt-4 px-2">
            &copy;{" "}
            <Link to="/">
              <span className="cursor-pointer">Zecky</span>
            </Link>
            . Được tạo bởi <span className="text-red-600">❤️</span>{" "}
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

export default LoginPage;

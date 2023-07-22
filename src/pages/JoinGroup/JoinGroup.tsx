import { RiMessage2Line } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { useQuery } from "react-query";
import instance from "../../config";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { Skeleton } from "@mui/material";
import { cn } from "../../servies/utils";
import { socket } from "../../components/ChatPerSonContainer/ChatPerSonContainer";
import { ModalStatus } from "../../components/Ui";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import "../../servies/translate/contfigTranslate";
interface IinfoRoom {
  name: string;
  _id: string;
  listUser: string[];
  des: string;
  avatar: { url: string };
}
const JoinGroup = () => {
  const { idRoom } = useParams();
  const account = useSelector((state: RootState) => state.userStore.account);
  const { t } = useTranslation();
  const navigate = useNavigate();
  if (!idRoom) {
    navigate("trang-khong-ton-tai");
  }
  const { data, isLoading } = useQuery({
    queryKey: ["todos", idRoom],
    queryFn: () => {
      return instance.post("room/info", { data: idRoom }).catch(() => {
        navigate("/trang-khong-ton-tai");
      });
    },
  });

  const inforoom: IinfoRoom = data?.data?.infoRoom;

  const isJoined = account.rooms.includes(idRoom || "zecky");
  const [isOpenStatus, setIsOpenStatus] = useState(false);
  const handleJoinGroup = (isSuccess: boolean) => {
    if (!isSuccess || !account._id) {
      setIsOpenStatus(false);
      return;
    }
    socket.emit("user-accpet-join-group", {
      idRoom: idRoom,
      status: true,
      userSendID: account._id,
    });
    navigate("/");
  };
  return (
    <>
      <Helmet>
        <title>
          Tham gia phòng {(inforoom && inforoom.name) || "zecky"} Zecky
        </title>
        <meta
          name="description"
          content={
            (inforoom && inforoom.des) ||
            "Zecky Ứng dụng tạo nhóm tuyệt vời con mặt trời, hãy tham gia sử dụng ngay"
          }
        />
      </Helmet>
      <div className="bg-white">
        <div className="container mx-auto  ">
          <header className="flex justify-center py-2  ">
            <h1
              onClick={() => navigate("/")}
              className=" font-bold text-3xl text-primary cursor-pointer"
            >
              Zecky
            </h1>
          </header>
        </div>
        <div className="bg-[#E4E8EC] h-[calc(100vh-84px)] py-4 flex justify-center">
          <div className="text-black  py-4 bg-white rounded-xl drop-shadow-md   h-auto md:h-[50vh] lg:w-[60%] md:w-80% w-[90%] md:flex block justify-around">
            <section className="md:flex block  gap-4 items-start ">
              <div className="flex justify-center md:mb-0 mb-2">
                {isLoading ? (
                  <Skeleton variant="circular" width={64} height={64} />
                ) : (
                  <img
                    src={
                      (inforoom && inforoom.avatar.url) || "/images/group.png"
                    }
                    className="w-16 h-16 rounded-full "
                  />
                )}
              </div>
              <div className="px-2 md:text-left text-center">
                <h2 className="font-2xl font-semibold capitalize">
                  {isLoading ? (
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  ) : (
                    (inforoom && inforoom.name) || "Zecky Group"
                  )}
                </h2>
                <p className="my-2 capitalize">{t("group")}</p>
                {!isLoading ? (
                  <button
                    disabled={isJoined}
                    onClick={() =>
                      account._id
                        ? setIsOpenStatus(true)
                        : navigate("/dang-nhap")
                    }
                    className={cn(
                      "flex gap-1  capitalize items-center opacity-90  justify-center background-primary text-white py-2 px-5 rounded-lg md:w-auto w-full",
                      isJoined
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:opacity-100"
                    )}
                  >
                    <RiMessage2Line />{" "}
                    {isJoined
                      ? t("isJoined")
                      : account._id
                      ? `${t("join")} ${t("group")}`
                      : `${t("login")} ${t("to")} ${t("join")} ${t("group")}`}
                  </button>
                ) : (
                  <Skeleton
                    variant="rectangular"
                    className="w-full"
                    height={40}
                  />
                )}
                <div className="mt-2">
                  <h4 className="font-semibold text-base">
                    {t("des")} {t("group")}
                  </h4>
                  <p className="text-sm py-2">
                    {isLoading ? (
                      <Skeleton
                        variant="rectangular"
                        className="w-full"
                        height={60}
                      />
                    ) : (
                      (inforoom && inforoom.des) ||
                      `${t("not")} ${t("des")} ${t("group")}`
                    )}
                  </p>
                </div>
              </div>
            </section>
            <section className="md:px-0 md:mt-0 mt-5  flex-col  flex items-center ">
              <div className="sm:max-w-[200px] max-w-[150px] flex justify-center">
                <QRCode
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={location.href}
                />
              </div>
              <p className="text-center mt-2 font-medium text-sm">
                {t("codeScan")} {t("join")} {t("to")} {t("group")}
              </p>
              <button
                onClick={() => navigate("/")}
                className="py-2 w-full px-4 text-primary-hover"
              >
                {t("home")}
              </button>
            </section>
          </div>
        </div>
        {isOpenStatus && (
          <ModalStatus
            callBackStatus={handleJoinGroup}
            title={`Bạn chắc chắc sẽ tham gia phòng ${inforoom?.name}`}
            kind="2"
          />
        )}
        <footer className="text-black text-center text-sm py-2 ">
          <p>© Copyright 2023 Zecky Group. All right Reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default JoinGroup;

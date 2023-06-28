import { RiMessage2Line } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import QRCode from "react-qr-code";
const JoinGroup = () => {
  const { nameGroup } = useParams();
  const navigate = useNavigate();
  if (!nameGroup) {
    navigate("trang-khong-ton-tai");
  }
  console.log(nameGroup);
  return (
    <div className="bg-white">
      <div className="container mx-auto  ">
        <header className="flex justify-center py-2  ">
          <h1 className=" font-bold text-3xl text-primary"> Zecky</h1>
        </header>
      </div>
      <div className="bg-[#E4E8EC] h-[calc(100vh-84px)] py-4 flex justify-center">
        <div className="text-black  py-4 bg-white rounded-xl drop-shadow-md   h-auto md:h-[50vh] lg:w-[60%] md:w-80% w-[90%] md:flex block justify-around">
          <section className="md:flex block  gap-4 items-start ">
            <div className="flex justify-center md:mb-0 mb-2">
              <img
                src="/images/group.png"
                className="w-16 h-16 rounded-full "
                alt=""
              />
            </div>
            <div className="px-2 md:text-left text-center">
              <h2 className="font-2xl font-semibold">
                WD17305_SYB3012_Khởi sự doanh nghiệp_SU2023
              </h2>
              <p className="my-2">Nhóm</p>
              <button className="flex gap-1 items-center opacity-90 hover:opacity-100 justify-center background-primary text-white py-2 px-5 rounded-lg md:w-auto w-full">
                <RiMessage2Line /> Tham gia Nhóm
              </button>
              <div className="mt-2">
                <h4 className="font-semibold text-base">Mô tả nhóm</h4>
                <p className="text-sm py-2">Hiện tại chưa có mô tả</p>
              </div>
            </div>
          </section>
          <section className="md:px-0 md:mt-0 mt-5  flex-col  flex items-center ">
            <div className="sm:max-w-[200px] max-w-[150px] flex justify-center">
              <QRCode
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value="https://zecky.online/"
              />
            </div>
            <p className="text-center mt-2 font-medium text-sm">
              Quét mã Qr tham gia nhóm
            </p>
          </section>
        </div>
      </div>
      <footer className="text-black text-center text-sm py-2 ">
        <p>© Copyright 2023 Zecky Group. All right Reserved.</p>
      </footer>
    </div>
  );
};

export default JoinGroup;

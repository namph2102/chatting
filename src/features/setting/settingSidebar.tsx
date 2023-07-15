import { Helmet } from "react-helmet";
import { BiChevronLeft } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import PersonInfo from "./personInfo";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import ThemeSettings from "./themeSetting";
import ProfileSettings from "./profileSettings";

const SettingsSidebar = () => {
  const navigation = useNavigate();
  const account = useSelector((state: RootState) => state.userStore.account);

  if (!account._id) return <p>Bạn chưa đăng nhập...</p>;
  return (
    <div>
      <Helmet>
        <title>Cài đặt thông tin </title>
      </Helmet>
      <h2 className="font-bold text-xl mb-4 flex items-center">
        <button
          onClick={() => navigation("/")}
          className="px-2 text-3xl lg:hidden"
        >
          <BiChevronLeft />
        </button>
        Cài đặt
      </h2>
      <section className="max-h-[calc(100vh-80px)] overflow-y-auto">
        <ProfileSettings account={account} />
        <p className="text-center mt-8 text-sm capitalize">
          {account.fullname}
        </p>
        <PersonInfo />
        <ThemeSettings />
      </section>
    </div>
  );
};

export default SettingsSidebar;

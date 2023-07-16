import { Helmet } from "react-helmet";
import { BiChevronLeft } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import PersonInfo from "./personInfo";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import ThemeSettings from "./themeSetting";
import ProfileSettings from "./profileSettings";
import InfoLoginUI from "../sidebar/component/infoLoginUI";
import "../../servies/translate/contfigTranslate";
import { useTranslation } from "react-i18next";
import LanguageSettings from "./languageSettings";
const SettingsSidebar = () => {
  const navigation = useNavigate();
  const account = useSelector((state: RootState) => state.userStore.account);
  const { t } = useTranslation();
  return (
    <div>
      <Helmet>
        <title>
          {t("settings")} {t("info")} Zecky
        </title>
      </Helmet>
      <div className="font-bold text-xl mb-4 flex items-center">
        <button
          onClick={() => navigation("/")}
          className="px-2 text-3xl lg:hidden"
        >
          <BiChevronLeft />
        </button>
        <span className="capitalize">
          {t("settings")} {t("info")}
        </span>
      </div>
      <section className="max-h-[calc(100vh-90px)] overflow-y-auto">
        {account._id ? (
          <>
            <ProfileSettings account={account} />
            <p className="text-center mt-8 text-sm capitalize">
              {account.fullname}
            </p>
            <PersonInfo />
            <ThemeSettings />
            <LanguageSettings />
          </>
        ) : (
          <InfoLoginUI />
        )}
      </section>
    </div>
  );
};

export default SettingsSidebar;

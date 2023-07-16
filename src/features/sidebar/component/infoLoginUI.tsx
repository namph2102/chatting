import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../../../servies/translate/contfigTranslate";

const InfoLoginUI = () => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center flex-wrap gap-2">
      <h2 className="w-full text-center">{t("haveAccount")} ?</h2>
      <Link to="/dang-nhap">
        <button className="background-primary py-2 px-5  text-white rounded-full text-sm">
          {t("login")}
        </button>
      </Link>
      <Link to="/dang-ky">
        <button className="background-primary-hover py-2 px-5 rounded-full text-sm">
          {" "}
          {t("register")}
        </button>
      </Link>
    </div>
  );
};

export default InfoLoginUI;

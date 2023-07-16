import "./styles/app.scss";
import Layout from "./features/layout";
import ImageLayout from "./assets/opengraph-image.png";
import AppInfomation from "./components/AppInfomation";
import { useEffect } from "react";
import { themeColor } from "./features/setting/themeSetting";
import i18n from "i18next";
function App() {
  useEffect(() => {
    // setupload theme
    const index = localStorage.getItem("primary-color");
    const language = localStorage.getItem("language") || "vi";
    i18n.changeLanguage(language);
    if (index && themeColor[Number(index)]) {
      document.documentElement.style.setProperty(
        "--primary-color",
        themeColor[Number(index)]
      );
    }
  }, []);
  return (
    <div className="myapp">
      <img
        alt="Zecky - Ứng dụng nhắn tin"
        role="img"
        src={ImageLayout}
        className="hidden"
      />
      <Layout />

      <AppInfomation />
    </div>
  );
}

export default App;

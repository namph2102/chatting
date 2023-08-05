import "./styles/app.scss";
import Layout from "./features/layout";
import ImageLayout from "./assets/opengraph-image.png";
import AppInfomation from "./components/AppInfomation";
import { useEffect } from "react";
import { themeColor } from "./features/setting/themeSetting";
import i18n from "i18next";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux";
import { updateLanguage } from "./redux/Slice/LangSlice";
function App() {
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    // setupload theme
    const pathName=location.pathname ||"";
    const language = localStorage.getItem("language") || "vi";
    if(pathName.includes("en-US")){
      i18n.changeLanguage('en');
      dispatch(updateLanguage('en'));
    }else if(pathName.includes("vi-VN")){
      i18n.changeLanguage('vi');
      dispatch(updateLanguage('vi'));
    }else{
      i18n.changeLanguage(language);
      dispatch(updateLanguage(language));
    }
    const index = localStorage.getItem("primary-color");
  
  
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

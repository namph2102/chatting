import "./styles/app.scss";
import Layout from "./features/layout";
import ImageLayout from "./assets/opengraph-image.png";
import AppInfomation from "./components/AppInfomation";
import { useEffect } from "react";
import { themeColor } from "./features/setting/themeSetting";
function App() {
  useEffect(() => {
    // setupload theme
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

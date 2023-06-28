import "./styles/app.scss";
import Layout from "./features/layout";
import ImageLayout from "./assets/opengraph-image.png";
import AppInfomation from "./components/AppInfomation";
function App() {
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

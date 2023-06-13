import "./styles/app.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./features/layout";
import ImageLayout from "./assets/opengraph-image.png";
import { useEffect } from "react";
import { firstloginWebsite } from "./redux/Slice/AccountSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux";

function App() {
  const dispacth: AppDispatch = useDispatch();
  useEffect(() => {
    localStorage.getItem("accessToken") && dispacth(firstloginWebsite());
  }, []);
  return (
    <div className="myapp">
      <img
        alt="Zecky - ứng dụng chat"
        role="img"
        src={ImageLayout}
        className="hidden"
      />
      <Layout />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
      />
    </div>
  );
}

export default App;

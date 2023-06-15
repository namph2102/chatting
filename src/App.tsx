import "./styles/app.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./features/layout";
import ImageLayout from "./assets/opengraph-image.png";
import { useEffect } from "react";
import { firstloginWebsite } from "./redux/Slice/AccountSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux";
import { socket } from "./components/ChatPerSonContainer/ChatPerSonContainer";
import { CapitalizeString, ToastNotify } from "./servies/utils";

function App() {
  const dispacth: AppDispatch = useDispatch();
  useEffect(() => {
    localStorage.getItem("accessToken") &&
      dispacth(firstloginWebsite()).then((acc) => {
        const userid = acc.payload?._id;
        if (userid) {
          socket.emit("client-acttaced-id", userid);

          socket.on("infomation-add-friend", (fullname) => {
            ToastNotify(
              CapitalizeString(fullname) + " đã gửi lời mời kết bạn"
            ).info({ autoClose: 3000 });
          });
          socket.on(
            "sever-send-result-add-friend",
            ({ isAccept, fullname }) => {
              if (isAccept) {
                ToastNotify(
                  CapitalizeString(fullname) + " đã chấp nhận lời mời kết bạn!"
                ).success();
              } else {
                ToastNotify(
                  CapitalizeString(fullname) + " đã từ chối lời mời kết bạn"
                ).info();
              }
            }
          );
        }
      });
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

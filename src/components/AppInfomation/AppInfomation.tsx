import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux";
import {
  firstloginWebsite,
  updateNotice,
} from "../../redux/Slice/AccountSlice";
import { socket } from "../ChatPerSonContainer/ChatPerSonContainer";
import "react-toastify/dist/ReactToastify.css";
import { CapitalizeString, ToastNotify } from "../../servies/utils";
import { ModalStatus } from "../Ui";
import AddFriend from "../Ui/AddFriend";
import { getDataListFriend } from "../../redux/Slice/SidebarSlice";
import { updatePersonStatus } from "../../redux/Slice/ChatPersonSlice";

export interface optionsPropsSelect {
  value: string;
  label: string;
}
const AppInfomation = () => {
  const dispacth: AppDispatch = useDispatch();
  const [infoRoomnotice, setInfoRoom] = useState<{
    idNotice: string;
    idRoom: string;
  }>({ idNotice: "", idRoom: "" });

  const { theme, account } = useSelector((state: RootState) => state.userStore);

  useEffect(() => {
    localStorage.getItem("accessToken") &&
      dispacth(firstloginWebsite()).then((acc: any) => {
        const userid = acc.payload?._id;
        if (userid) {
          dispacth(getDataListFriend(userid));
        }
      });
  }, []);

  useEffect(() => {
    if (!account._id) return;

    socket.emit("client-acttaced-id", account._id);
    // Sever gửi thông báo cho chính mình
    socket.on("server-send-message-myself", (message) => {
      ToastNotify(message).success();
      dispacth(updateNotice(1));
      dispacth(getDataListFriend(account._id));
    });
    // khi có người mời tham gia room
    socket.on(
      `invite-to-join-room-${account._id}`,
      ({ fullname, idNotice, idRoom }) => {
        setInfoRoom({ idNotice, idRoom });
        setMessageModalStatus(
          CapitalizeString(fullname) + " đã gửi lời mời tham gia nhóm"
        );
        dispacth(updateNotice(1));
      }
    );
    // khi có nguoi đã đồng ý tham gia nhóm mà bạn đã mời
    socket.on("sever-send-update-when-user-joined", (data) => {
      dispacth(updateNotice(1));
      dispacth(getDataListFriend(account._id));
      if (data && data?.fullname) {
        dispacth(
          updatePersonStatus({ fullname: data.fullname, avatar: data.url })
        );
      }

      console.log("reload lại");
    });

    // khi có người mời kết bạn
    socket.on(`infomation-add-friend-${account._id}`, (fullname) => {
      dispacth(updateNotice(1));
      ToastNotify(CapitalizeString(fullname) + " đã gửi lời mời kết bạn").info({
        autoClose: 3000,
      });
    });
    socket.on("reload-show-friends-whenaccept", () => {
      dispacth(getDataListFriend(account._id));
    });
    socket.on("sever-send-result-add-friend", ({ isAccept, fullname }) => {
      dispacth(updateNotice(0));
      if (isAccept) {
        ToastNotify(
          CapitalizeString(fullname) + " đã chấp nhận lời mời kết bạn!"
        ).success();
      } else {
        ToastNotify(
          CapitalizeString(fullname) + " đã từ chối lời mời kết bạn"
        ).info();
      }
    });
  }, [account._id]);
  // room will join;

  const handleGetInfoCreateRoom = async (
    nameRoom: string,
    listAdd: optionsPropsSelect[]
  ) => {
    if (listAdd?.length > 0) {
      socket.emit("user-create-group", {
        userSendID: account._id,
        nameRoom,
        listIdInvited: listAdd.map((item) => item.value) || [],
        fullname: account.fullname,
      });
    }
  };
  const [messageModalStatus, setMessageModalStatus] = useState("");
  const handleAcceptCreateRoom = (isStatus: boolean) => {
    if (isStatus) {
      socket.emit("user-accpet-join-group", {
        idNotice: infoRoomnotice.idNotice,
        idRoom: infoRoomnotice.idRoom,
        status: isStatus,
        userSendID: account._id,
      });
    }
    setMessageModalStatus("");
  };
  const isOpenFormCreateRoom = useSelector(
    (state: RootState) => state.personStore.isOpenFormCreateRoom
  );
  return (
    <div>
      {messageModalStatus && (
        <ModalStatus
          title={messageModalStatus}
          callBackStatus={handleAcceptCreateRoom}
        ></ModalStatus>
      )}

      {isOpenFormCreateRoom && (
        <AddFriend
          handleCallback={handleGetInfoCreateRoom}
          idBG={theme.darkmode}
        />
      )}
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
};

export default AppInfomation;

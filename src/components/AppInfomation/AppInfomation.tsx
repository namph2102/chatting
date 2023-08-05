import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux";
import {
  firstloginWebsite,
  updateNotice,
  updatePeerjs,
  updateSettingVideoCall,
} from "../../redux/Slice/AccountSlice";
import { socket } from "../ChatPerSonContainer/ChatPerSonContainer";
import "react-toastify/dist/ReactToastify.css";
import { CapitalizeString, ToastNotify } from "../../servies/utils";
import { ModalStatus } from "../Ui";
import AddFriend from "../Ui/AddFriend";
import {
  getDataListFriend,
  updateInfoNameFriend,
} from "../../redux/Slice/SidebarSlice";
import {
  personInit,
  updatePerson,
  updatePersonStatus,
} from "../../redux/Slice/ChatPersonSlice";
import { handleCreateStoreComment } from "../ChatPerSonContainer/util";
import Video from "../webmedia/Video";

export interface optionsPropsSelect {
  value: string;
  label: string;
}
// lưu trữ tất cả dữ liệu khi load vào comment
export const StoreComment = handleCreateStoreComment();
const AppInfomation = () => {
  const dispacth: AppDispatch = useDispatch();
  const [infoRoomnotice, setInfoRoom] = useState<{
    idNotice: string;
    idRoom: string;
  }>({ idNotice: "", idRoom: "" });

  const { theme, account, settingVideoCall, idPeerJs } = useSelector(
    (state: RootState) => state.userStore
  );
  const person = useSelector((state: RootState) => state.personStore.person);
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
    });

    // khi có người mời kết bạn
    socket.on(`infomation-add-friend-${account._id}`, (fullname) => {
      dispacth(updateNotice(1));
      ToastNotify(CapitalizeString(fullname) + " đã gửi lời mời kết bạn").info({
        autoClose: 3000,
      });
    });
    // khi có người Bạn thay đổi  tên
    socket.on("friend-change-fullname-profile", ({ id, key, value }) => {
      dispacth(updateInfoNameFriend({ id, key, value }));
    });
    //
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
  useEffect(() => {
    if (!account._id) return;
    socket.on("client-chat-with-bot", (roomid) => {
      if (account.rooms.includes(roomid)) {
        dispacth(firstloginWebsite());
      }
      dispacth(updatePersonStatus(personInit));
    });
  }, [account._id]);
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

  const [isOpenVideoCall, setIsOpenVideoCall] = useState(false);

  const [messageVideoCall, setMessageVideoCall] = useState("");

  // call video
  useEffect(() => {
    if (
      settingVideoCall.type == "friend" &&
      person.typechat == "friend" &&
      person.fullname &&
      settingVideoCall.isOpen
    ) {
      setIsOpenVideoCall(true);
      if (idPeerJs) {
        socket.emit("user-join-room-call", {
          idPeerJs,
          idAccount: account._id,
          personid: person._id,
          fullname: account.fullname,
          roomId: person.idRoom,
          avatar: account.avatar,
        });
      }
    }
    return () => {
      settingVideoCall.isOpen && setIsOpenVideoCall(false);
    };
  }, [isOpenVideoCall, settingVideoCall, idPeerJs]);
  useEffect(() => {
    socket.on(
      "sever-send-open-status-call",
      ({ idPeerJs, idAccount, roomId, fullname, avatar }) => {
        setMessageVideoCall(`${CapitalizeString(fullname)} đang gọi cho bạn`);
        dispacth(updatePeerjs(idPeerJs));
        dispacth(
          updatePerson({
            _id: idAccount,
            idRoom: roomId,
            avatar,
            fullname,
            typechat: "friend",
            status: true,
          })
        );
      }
    );
    socket.on("server-send-leave-room-call", () => {
      setIsOpenVideoCall((prev) => !prev);
      dispacth(updateSettingVideoCall({ isOpen: false }));
      dispacth(updatePeerjs(""));
      setMessageVideoCall(``);
    });
  }, []);
  const handleAcceptCall = (isAccept: boolean) => {
    if (isAccept) {
      setIsOpenVideoCall(true);
      dispacth(updateSettingVideoCall({ isOpen: true }));
    } else {
      setIsOpenVideoCall(false);
      dispacth(updateSettingVideoCall({ isOpen: false }));
    }
    setMessageVideoCall(``);
  };

  return (
    <div>
      {isOpenVideoCall && settingVideoCall.isOpen && <Video />}
      {!isOpenVideoCall && messageVideoCall && (
        <ModalStatus
          title={messageVideoCall}
          callBackStatus={handleAcceptCall}
        ></ModalStatus>
      )}
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

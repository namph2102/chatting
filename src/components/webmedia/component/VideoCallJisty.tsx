import { useEffect, useState } from "react";
import Jitsi from "react-jitsi";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";

export default function App() {
  const account = useSelector((state: RootState) => state.userStore.account);
  const [displayName, setDisplayName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [onCall, setOnCall] = useState(false);
  console.log(account);
  useEffect(() => {
    if (!account._id) return;

    setDisplayName(account.fullname);
    setRoomName(account.username);
    setOnCall(true);
  }, [account, account._id, account.fullname, account.username]);
  const handleAPILoad = () => {
    const idIfame: HTMLIFrameElement | null =
      document.querySelector("#react-jitsi-frame");
    if (idIfame) {
      idIfame.style.display = "block";
    }
    // You can perform additional actions with the Jitsi Meet API here
  };
  return onCall ? (
    <>
      <Jitsi
        roomName={roomName}
        displayName={displayName}
        domain="8x8.vc"
        config={{ startAudioOnly: true }}
        interfaceConfig={{ filmStripOnly: true }}
        onAPILoad={handleAPILoad}
        containerStyle={{ width: "full", height: "full" }}
      />
    </>
  ) : (
    <>
      <h1>Them gia phòng cùng Zecky</h1>
      <input
        type="text"
        placeholder="Đặt tên Phòng"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tên của bạn"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <button onClick={() => setOnCall(true)}> Let&apos;s start!</button>
    </>
  );
}

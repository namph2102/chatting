import { FC, useEffect } from "react";
import { io } from "socket.io-client";
import { PserSonChating } from "../../redux/Slice/ChatPersonSlice";
const domainSever = import.meta.env.VITE_DOMAIN_SEVER;
const socket = io(domainSever, { transports: ["websocket"] });
interface ChatPerSonContainerProps {
  person: PserSonChating;
}
const ChatPerSonContainer: FC<ChatPerSonContainerProps> = ({ person }) => {
  console.log(person);
  useEffect(() => {
    // client-side
    socket.on("connect", () => {
      console.log(socket.id); //
    });

    socket.on("disconnect", () => {
      console.log(socket.id); // undefined
    });
  }, []);
  return <div>ChatPerSonContainer</div>;
};

export default ChatPerSonContainer;

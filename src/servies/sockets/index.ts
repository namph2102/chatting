import { socket } from "../../components/ChatPerSonContainer/ChatPerSonContainer";

export const handleAddFriendSocket = (data: {
  fullname: string;
  userSend: string;
  userAccept: string;
}) => {
  socket.emit("add-friend", data);
};

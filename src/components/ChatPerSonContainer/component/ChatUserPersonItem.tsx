import { FC } from "react";
import ChatContent from "../../chatContainer/ChatContent";

export interface ChatUserPersonItemProps {
  isSee: boolean;
  isUser: boolean;
  comment: string;
  updatedAt: string;
  author: {
    _id: string;
    avatar: string;
    fullname: string;
  };
}
const ChatUserPersonItem: FC<ChatUserPersonItemProps> = (account) => {
  return (
    <ChatContent
      type="translate"
      time={account.updatedAt}
      isUser={account.isUser}
      comment={account.comment}
      id={account.author._id}
      isSee={account.isSee}
      avatar={account.author.avatar}
    />
  );
};

export default ChatUserPersonItem;

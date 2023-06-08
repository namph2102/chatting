import { chatbotPrompt } from "../contants/chatbot-promps";
import { ChatGPTMessage } from "./openai-stream";
import { MessageArraySchema } from "../validator";
import { messageType } from "../../components/chatContainer/chat.type";
let totalchatbotPrompt: string = chatbotPrompt;
export const handleRequestMessage = (messages: messageType[]) => {
  const parsedMessages = MessageArraySchema.parse(messages);

  const outboundMessages: ChatGPTMessage[] = parsedMessages.map((message) => {
    totalchatbotPrompt += message.text;
    return {
      role: message.isUserMessage ? "user" : "system",
      content: message.text,
    };
  });

  outboundMessages.unshift({ role: "system", content: totalchatbotPrompt });

  const payload = {
    model: "gpt-3.5-turbo",
    messages: outboundMessages,
    temperature: 0.4,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 1,
    max_tokens: 2000,
    stream: true,
    n: 1,
  };
  return payload;
};

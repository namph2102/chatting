import { chatbotPrompt } from "../contants/chatbot-promps";
import { ChatGPTMessage } from "./openai-stream";
import { MessageArraySchema } from "../validator";
import { messageType } from "../../components/chatContainer/chat.type";
let totalchatbotPrompt: string = chatbotPrompt;
let totalChat = 0;
export const handleRequestMessage = (messages: messageType[]) => {
  const parsedMessages = MessageArraySchema.parse(messages);

  const outboundMessages: ChatGPTMessage[] = parsedMessages.map((message) => {
    ++totalChat;
    totalchatbotPrompt += message.text;
    if (totalChat > 2 || totalchatbotPrompt.length > 3000) {
      totalchatbotPrompt = message.text;
      totalChat = 0;
    }
    return {
      role: message.isUserMessage ? "user" : "system",
      content: message.text,
    };
  });

  outboundMessages.unshift({ role: "system", content: totalchatbotPrompt });

  const payload = {
    model: "gpt-3.5-turbo",
    messages: outboundMessages,
    temperature: 0.6,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 1,
    max_tokens: 3000,
    stream: true,
    n: 1,
  };
  return payload;
};
export const handleTranslate = (message: string) => {
  const payload = {
    model: "text-davinci-003",
    prompt: `Write a creative ad for the following product to run on Facebook aimed at parents, childrent, student and write SEO keywork for products you must traslate vietname:\n\nProduct: ${message}`,
    temperature: 0.5,
    max_tokens: 200,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  };
  return payload;
};

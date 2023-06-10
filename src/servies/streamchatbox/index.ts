import { z } from "zod";
export const MessageSchema = z.object({
  id: z.string(),
  isUserMessage: z.boolean(),
  text: z.string(),
});
export const streamTextOpenAi = async (
  render: ReadableStreamDefaultReader<Uint8Array> | undefined,
  callback: (message: string) => void
) => {
  const decoder = new TextDecoder("utf-8");
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const chuck: any = await render?.read();
    const { done, value } = chuck;
    if (done) {
      break;
    }
    const decodeChuck = decoder.decode(value);
    const lines: string[] = decodeChuck.split("\n");
    const paintlines = lines
      .map((line) => line.replace(/^data: /, "").trim())
      .filter((line) => line !== "" && line !== "[DONE]")
      .map((item) => JSON.parse(item));
    for (const paintLine of paintlines) {
      const { choices } = paintLine;
      const { delta } = choices[0];
      const { content } = delta;
      if (content) {
        callback(content);
      }
    }
  }
};
//Array Validator
export const MessageArraySchema = z.array(MessageSchema);
export type Message = z.infer<typeof MessageSchema>;

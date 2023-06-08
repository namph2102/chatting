import axios from "axios";
import { messageType } from "../../components/chatContainer/chat.type";
import { handleRequestMessage } from "./handleFeatchData";
import {
  Spotify,
  appClient,
} from "../../components/chatContainer/component/spotify/spotify.contant";

const VITE_OPEN_AI_KEY = import.meta.env.VITE_OPEN_AI_KEY;
const VITE_GOOGLE_AI_KEY = import.meta.env.VITE_GOOGLE_AI_KEY;

export type ChatGPTAgent = "user" | "system";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export interface OpenAIStreamPayload {
  model: string;
  messages: ChatGPTMessage[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
}
export interface VideoItem {
  id: string;
  title: string;
  thumbnail: {
    default: { url: string };
    high: { url: string };
    medium: { url: string };
  };
  publishTime: string;
  publishedAt: string;
}
export enum TypeSearchSpotify {
  album = "album",
  artist = "artist",
  playlist = "playlist",
  track = "track",
  show = "show",
  episode = "episode",
  audiobook = "audiobook",
}
class OpenAIStream {
  #url_create_message = "https://api.openai.com/v1/chat/completions";
  #url_create_image = "https://api.openai.com/v1/images/generations";
  async createMessage(
    message: messageType,
    callback: (message: string) => void
  ) {
    try {
      const payload = handleRequestMessage([message]);
      console.log(payload);
      const res = await fetch(this.#url_create_message, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + VITE_OPEN_AI_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const render = res.body?.getReader();
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
    } catch {
      throw new Error(
        "Xin lỗi bạn! Có lẽ API Code của tôi đã hết hạn! Bạn có thể bảo <a target='_blank' class='text-primary text-primary-hover' href=`https://www.facebook.com/namhoai2102`>'Hoài Nam'</a> của tôi đi gia hạn không ? Tôi đang rất cần ạ!"
      );
    }
  }
  async createImage(prompt: string, size = "512x512", n = 4) {
    const data = {
      prompt,
      size,
      n,
    };
    try {
      const creatimage = await fetch(this.#url_create_image, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + VITE_OPEN_AI_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return await creatimage.json();
    } catch {
      throw new Error("Khâu xử lý ảnh đang gặp vấn đề. Bạn thử lại nha?");
    }
  }
  async getListYoutube(query: string, length = 12) {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            key: VITE_GOOGLE_AI_KEY,
            q: query,
            part: "snippet",
            maxResults: length,
            type: "video",
          },
        }
      );
      const videoItems: VideoItem[] = response.data.items.map((item: any) => {
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails,
          publishTime: item.snippet.publishTime,
          publishedAt: item.snippet.publishedAt,
        };
      });

      return videoItems;
    } catch {
      throw new Error(
        "Đã có chuyện gì xảy ra với chúng tôi rồi bạn vui lòng chờ nhá!"
      );
    }
  }
  async getListSearchSpotify(
    search: string,
    typeSerach: TypeSearchSpotify = TypeSearchSpotify.album
  ) {
    try {
      return appClient
        .get("/me")
        .then(async () => {
          const res = await appClient.get("search", {
            params: {
              q: search,
              type: typeSerach,
            },
          });
          const data = await res.data;
          const listCover: Spotify[] = data[`${typeSerach}s`].items.map(
            (item: any) => {
              const type = item.type;
              const uri = item.uri;
              const artists = item.artists;
              const id = item.id;
              const images = item.images;
              const name = item.name;
              return {
                music: { images, name, type, id, uri },
                artists: artists,
              };
            }
          );
          if (listCover.length <= 0) throw new Error("Không tìm thấy bài nào?");
          return listCover;
        })
        .catch(() => new Error("Bạn chưa đăng nhập spotify"));
    } catch (err: { message: string } | any) {
      throw new Error(err.message);
    }
  }
}
export default new OpenAIStream();
// https://github.com/mpetazzoni/sse.js
// https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
// https://web.dev/streams/#asynchronous-iteration

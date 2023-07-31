import axios from "axios";
import { messageType } from "../../components/chatContainer/chat.type";
import { handleRequestMessage } from "./handleFeatchData";
import { Spotify } from "../../components/chatContainer/component/spotify/spotify.contant";
import { Configuration, OpenAIApi } from "openai";
import { streamTextOpenAi } from ".";

const VITE_MUSIC_CLIENT_DOMAIN =
  import.meta.env.VITE_MUSIC_CLIENT_DOMAIN ||
  "https://zeckysever.onrender.com/music/";

export const zingAxios = axios.create({
  baseURL: VITE_MUSIC_CLIENT_DOMAIN,
  headers: { "Content-Type": "application/json" },
});
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
class CustomFormData extends FormData {
  getHeaders() {
    return {};
  }
}
const configuration = new Configuration({
  apiKey: VITE_OPEN_AI_KEY,
  formDataCtor: CustomFormData,
});
class OpenAIStream {
  #url_create_message = "https://api.openai.com/v1/chat/completions";
  #url_create_image = "https://api.openai.com/v1/images/generations";
  async createMessage(
    message: messageType,
    callback: (message: string) => void
  ) {
    try {
      const payload = handleRequestMessage([message]);
      const res = await fetch(this.#url_create_message, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + VITE_OPEN_AI_KEY,
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });
      const render = res.body?.getReader();
      await streamTextOpenAi(render, callback);
    } catch {
      throw new Error(
        `Xin lỗi bạn! ChatPGT đã hết hạn sử dụng bạn có thể vào  <a class="text-blue-400 hover:text-blue-500" href="http://help.zecky.online/">help.zecky.online</a> để sử dụng nhé!`
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
  async getListSearchSpotify(search: string) {
    const responsive = await zingAxios.get("search", {
      params: {
        keyword: search,
      },
    });
    const responsiveZingmp3: {
      msg: string;
      data: {
        counter: { song: number };
        artists: any;
        songs: any;
        top: any;
        videos: any[];
      };
    } = await responsive.data;

    if (
      responsiveZingmp3.msg.toLowerCase() !== "success" ||
      responsiveZingmp3.data.counter.song <= 0
    ) {
      throw new Error(
        "Xin lỗi bạn! Mình không tìm thấy theo từ khóa: " + search
      );
    }

    try {
      const listPlaylist: Spotify = {
        top: { cover: "", id: "", name: "", playlistId: "", thumbnail: "" },
        song: [
          {
            music: {
              duration: 0,
              encodeId: "",
              title: "",
              thumbnail: "",
              thumbnailM: "",
              type: "",
            },
            artists: [],
          },
        ],
      };
      const song = responsiveZingmp3.data?.songs?.map((item: any) => {
        return {
          music: {
            encodeId: item.encodeId,
            title: item.title,
            thumbnail: item.thumbnail,
            thumbnailM: item.thumbnailM,
            duration: item.duration,
            type: "song",
          },
          artists: item.artists,
        };
      });

      listPlaylist.top = responsiveZingmp3.data.top;
      listPlaylist.song = song;

      if (listPlaylist && listPlaylist?.song?.length > 0) {
        return listPlaylist;
      }
      throw new Error("Không tìm thấy theo yêu cầu của bạn!");
    } catch (err: { message: string } | any) {
      throw new Error(err.message);
    }
  }
  async getTextInAudio(file: File, language = "en") {
    const openai = new OpenAIApi(configuration);

    const res = await openai.createTranscription(
      file,
      "whisper-1",
      "phiên dịch đầy đủ và chi tiết cho đoạn âm thanh đó",
      undefined,
      0.2,
      language
    );
    const data =
      language == "en"
        ? { data: { text: "" } }
        : await openai.createTranslation(
            file,
            "whisper-1",
            undefined,
            undefined,
            0.2
          );

    return (
      res.data.text +
      (language !== "en" ? " <br/>  <br/>  <br/>  " + data.data.text : "")
    );
  }
}
export default new OpenAIStream();
// https://github.com/mpetazzoni/sse.js
// https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
// https://web.dev/streams/#asynchronous-iteration

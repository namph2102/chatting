import { ChatContentProps } from "./ChatContent";
export const handleCoverComment = (str: string) => {
  if (str.includes("```")) {
    str = str.replace(/```/g, "");
  }
  if (str.includes("\n\n")) {
    str = str
      .split("\n\n")
      .map((lineString) => {
        const char = lineString.trim();

        if (
          !isNaN(Number(char[0])) &&
          char[1] == "." &&
          char[char.length - 1] == "."
        ) {
          return char;
        } else if (
          char.length > 4 &&
          (char[char.length - 1] == "." || char[char.length - 1] == ";")
        ) {
          return char + "\n";
        }
        return char + "\n";
      })
      .join("\n");
  }

  return str;
};
export const HandleCoverStringEntries = (str: string) => {
  str = str.trim();
  if (str.includes("<")) {
    str = str.replace(/</, "&lt;");
  }
  if (str.includes(">")) {
    str = str.replace(/>/, "&gt;");
  }
  if (str.includes("  ")) {
    str = str.replace(/\s{2}/g, " ");
  }
  if (str.includes("```")) {
    str = str.replace(/```/, " ");
  }

  return str;
};

export const initState: ChatContentProps[] = [
  {
    id: "chatbot",
    comment:
      "Chào mừng bạn đã đến với Zecky! Hiện tại Website vẫn đang trong giai đoạn phát triển. Rất vui và hãy sử dụng một số tiện ích có sẵn được xây dựng bởi ChatGPT phiên bản Plus hoàn toàn miễn phí tại chúng tôi. </br> Cảm ơn bạn đã sử dụng!",
    isUser: false,
    avatar: "/images/icon.ico",
    time: new Date().toISOString(),
    type: "text",
    isSee: true,
  },
];
export const StoreCommentChatBot: ChatContentProps[] = [...initState];
// action
const ADD_COMENT = "ADD_COMENT";
// const DETELE_COMENT = "DETELE_COMENT";
// const UPDATE_COMENT = "UPDATE_COMENT";
//handle
export const handleAddComment = (payload: ChatContentProps) => {
  return {
    type: ADD_COMENT,
    payload,
  };
};
export const CommentReducer = (
  state: ChatContentProps[],
  action: { type: string; payload: ChatContentProps }
) => {
  switch (action.type) {
    case ADD_COMENT:
      StoreCommentChatBot.push(action.payload);
      return [...StoreCommentChatBot];

    default:
      return [...state];
  }
};
export const handleCopyText = (e: any, text: string) => {
  if (e) {
    const ElementCreate = document.createElement("p");
    ElementCreate.innerHTML = text;
    navigator.clipboard
      .writeText(ElementCreate.textContent || "Copy thất bại!")
      .then(() => {
        e.target.innerHTML = "Đã sao chép!";
      })
      .catch(() => {
        e.target.innerHTML = "Sao chép thất bại!";
      });
  }
};
export const SpeakText = (text: string) => {
  const ElementCreate = document.createElement("p");
  ElementCreate.innerHTML = text;
  const valueSpeadk = ElementCreate.textContent || "Chúng tôi không đọc được";
  const utterance: any = new SpeechSynthesisUtterance();
  utterance.text = valueSpeadk;
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;
  speechSynthesis.speak(utterance);
};
export const optionsImage = [
  { title: "Ảnh 512x512", value: "512" },
  { title: "Ảnh 1024x1024", value: "1024" },
  { title: "Ảnh 256x256", value: "256" },
];
export const optionsTranscriptions = [
  { value: "en", title: "Anh" },
  { value: "vi", title: "Việt Nam" },
  { value: "zh", title: "Trung Hoa" },
  { value: "fr", title: "Pháp" },
  { value: "de", title: "Đức" },
  { value: "ja", title: "Nhật Bản" },
  { value: "th", title: "Thái Lan" },
  { value: "lo", title: "Lào" },
  { value: "es", title: "Tây Ban nha" },
  { value: "aa", title: "Afar" },
  { value: "ab", title: "Abkhazian" },
  { value: "ae", title: "Avestan" },
  { value: "af", title: "Afrikaans" },
  { value: "ak", title: "Akan" },
  { value: "am", title: "Amharic" },
  { value: "an", title: "Aragonese" },
  { value: "ar", title: "Arabic" },
  { value: "as", title: "Assamese" },
  { value: "av", title: "Avaric" },
  { value: "ay", title: "Aymara" },
  { value: "az", title: "Azerbaijani" },
  { value: "ba", title: "Bashkir" },
  { value: "be", title: "Belarusian" },
  { value: "bg", title: "Bulgarian" },
  { value: "bh", title: "Bihari languages" },
  { value: "bi", title: "Bislama" },
  { value: "bm", title: "Bambara" },
  { value: "bn", title: "Bengali" },
  { value: "bo", title: "Tibetan" },
  { value: "br", title: "Breton" },
  { value: "bs", title: "Bosnian" },
  { value: "ca", title: "Catalan" },
  { value: "ce", title: "Chechen" },
  { value: "ch", title: "Chamorro" },
  { value: "co", title: "Corsican" },
  { value: "cr", title: "Cree" },
  { value: "cs", title: "Czech" },
  { value: "cu", title: "Church Slavic" },
  { value: "cv", title: "Chuvash" },
  { value: "cy", title: "Welsh" },
  { value: "da", title: "Danish" },

  { value: "dv", title: "Maldivian" },
  { value: "dz", title: "Dzongkha" },
  { value: "ee", title: "Ewe" },
  { value: "el", title: "Greek" },
  { value: "eo", title: "Esperanto" },
  { value: "et", title: "Estonian" },
  { value: "eu", title: "Basque" },
  { value: "fa", title: "Persian" },
  { value: "ff", title: "Fulah" },
  { value: "fi", title: "Finnish" },
  { value: "fj", title: "Fijian" },
  { value: "fo", title: "Faroese" },

  { value: "fy", title: "Western Frisian" },
  { value: "ga", title: "Irish" },
  { value: "gd", title: "Gaelic" },
  { value: "gl", title: "Galician" },
  { value: "gn", title: "Guarani" },
  { value: "gu", title: "Gujarati" },
  { value: "gv", title: "Manx" },
  { value: "ha", title: "Hausa" },
  { value: "he", title: "Hebrew" },
  { value: "hi", title: "Hindi" },
  { value: "ho", title: "Hiri Motu" },
  { value: "hr", title: "Croatian" },
  { value: "ht", title: "Haitian" },
  { value: "hu", title: "Hungarian" },
  { value: "hy", title: "Armenian" },
  { value: "hz", title: "Herero" },
  { value: "ia", title: "Interlingua" },
  { value: "id", title: "Indonesian" },
  { value: "ie", title: "Interlingue" },
  { value: "ig", title: "Igbo" },
  { value: "ii", title: "Sichuan Yi" },
  { value: "ik", title: "Inupiaq" },
  { value: "io", title: "Ido" },
  { value: "is", title: "Icelandic" },
  { value: "it", title: "Italian" },
  { value: "iu", title: "Inuktitut" },

  { value: "jv", title: "Javanese" },
  { value: "ka", title: "Georgian" },
  { value: "kg", title: "Kongo" },
  { value: "ki", title: "Kikuyu" },
  { value: "kj", title: "Kuanyama" },
  { value: "kk", title: "Kazakh" },
  { value: "kl", title: "Kalaallisut" },
  { value: "km", title: "Central Khmer" },
  { value: "kn", title: "Kannada" },
  { value: "ko", title: "Korean" },
  { value: "kr", title: "Kanuri" },
  { value: "ks", title: "Kashmiri" },
  { value: "ku", title: "Kurdish" },
  { value: "kv", title: "Komi" },
  { value: "kw", title: "Cornish" },
  { value: "ky", title: "Kirghiz" },
  { value: "la", title: "Latin" },
  { value: "lb", title: "Luxembourgish" },
  { value: "lg", title: "Ganda" },
  { value: "li", title: "Limburgan" },
  { value: "ln", title: "Lingala" },

  { value: "lt", title: "Lithuanian" },
  { value: "lu", title: "Luba-Katanga" },
  { value: "lv", title: "Latvian" },
  { value: "mg", title: "Malagasy" },
  { value: "mh", title: "Marshallese" },
  { value: "mi", title: "Maori" },
  { value: "mk", title: "Macedonian" },
  { value: "ml", title: "Malayalam" },
  { value: "mn", title: "Mongolian" },
  { value: "mr", title: "Marathi" },
  { value: "ms", title: "Malay" },
  { value: "mt", title: "Maltese" },
  { value: "my", title: "Burmese" },
  { value: "na", title: "Nauru" },
  { value: "nb", title: "Norwegian" },
  { value: "nd", title: "North Ndebele" },
  { value: "ne", title: "Nepali" },
  { value: "ng", title: "Ndonga" },
  { value: "nl", title: "Dutch" },
  { value: "nn", title: "Norwegian" },
  { value: "no", title: "Norwegian" },
  { value: "nr", title: "South Ndebele" },
  { value: "nv", title: "Navajo" },
  { value: "ny", title: "Chichewa" },
  { value: "oc", title: "Occitan" },
  { value: "oj", title: "Ojibwa" },
  { value: "om", title: "Oromo" },
  { value: "or", title: "Oriya" },
  { value: "os", title: "Ossetic" },
  { value: "pa", title: "Panjabi" },
  { value: "pi", title: "Pali" },
  { value: "pl", title: "Polish" },
  { value: "ps", title: "Pushto" },
  { value: "pt", title: "Portuguese" },
  { value: "qu", title: "Quechua" },
  { value: "rm", title: "Romansh" },
  { value: "rn", title: "Rundi" },
  { value: "ro", title: "Romanian" },
  { value: "ru", title: "Russian" },
  { value: "rw", title: "Kinyarwanda" },
  { value: "sa", title: "Sanskrit" },
  { value: "sc", title: "Sardinian" },
  { value: "sd", title: "Sindhi" },
  { value: "se", title: "Northern Sami" },
  { value: "sg", title: "Sango" },
  { value: "si", title: "Sinhala" },
  { value: "sk", title: "Slovak" },
  { value: "sl", title: "Slovenian" },
  { value: "sm", title: "Samoan" },
  { value: "sn", title: "Shona" },
  { value: "so", title: "Somali" },
  { value: "sq", title: "Albanian" },
  { value: "sr", title: "Serbian" },
  { value: "ss", title: "Swati" },
  { value: "st", title: "Sotho, Southern" },
  { value: "su", title: "Sundanese" },
  { value: "sv", title: "Swedish" },
  { value: "sw", title: "Swahili" },
  { value: "ta", title: "Tamil" },
  { value: "te", title: "Telugu" },
  { value: "tg", title: "Tajik" },

  { value: "ti", title: "Tigrinya" },
  { value: "tk", title: "Turkmen" },
  { value: "tl", title: "Tagalog" },
  { value: "tn", title: "Tswana" },
  { value: "to", title: "Tonga" },
  { value: "tr", title: "Turkish" },
  { value: "ts", title: "Tsonga" },
  { value: "tt", title: "Tatar" },
  { value: "tw", title: "Twi" },
  { value: "ty", title: "Tahitian" },
  { value: "ug", title: "Uighur" },
  { value: "uk", title: "Ukrainian" },
  { value: "ur", title: "Urdu" },
  { value: "uz", title: "Uzbek" },
  { value: "ve", title: "Venda" },

  { value: "vo", title: "Volapük" },
  { value: "wa", title: "Walloon" },
  { value: "wo", title: "Wolof" },
  { value: "xh", title: "Xhosa" },
  { value: "yi", title: "Yiddish" },
  { value: "yo", title: "Yoruba" },
  { value: "za", title: "Zhuang" },

  { value: "zu", title: "Zulu" },
];

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
  console.log(str);
  return str;
};

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
      return [...state, action.payload];
    default:
      return state;
  }
};

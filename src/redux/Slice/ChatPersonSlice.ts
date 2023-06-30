import { createSlice } from "@reduxjs/toolkit";
export interface PserSonChating {
  _id: string;
  avatar: string;
  fullname: string;
  status: boolean;
  updatedAt?: string;
  typechat: "friend" | "group" | "chatbot";
  idRoom?: string;
}
export const personInit: PserSonChating = {
  _id: "chatbot",
  avatar: "/images/botai.png",
  fullname: "ChatGPT-Plus",
  status: true,
  typechat: "chatbot",
};
const initState: {
  person: PserSonChating;
  isOpenFormCreateRoom: boolean;
} = {
  person: personInit,
  isOpenFormCreateRoom: false,
};
const PersonSlice = createSlice({
  name: "person",
  initialState: initState,
  reducers: {
    updatePerson(state, action) {
      if (state.person._id != action.payload._id) {
        state.person = { ...state.person, ...action.payload };
      }
    },
    updatePersonStatus(state, action) {
      state.person = { ...state.person, ...action.payload };
    },
    updateIsOpenFormRoom(state, action) {
      if (action) {
        state.isOpenFormCreateRoom = !state.isOpenFormCreateRoom;
      }
    },
  },
});
export default PersonSlice.reducer;
export const { updatePerson, updatePersonStatus, updateIsOpenFormRoom } =
  PersonSlice.actions;

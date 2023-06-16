import { createSlice } from "@reduxjs/toolkit";
export interface PserSonChating {
  _id: string;
  avatar: string;
  fullname: string;
  status: boolean;
  updatedAt?: string;
}
export const personInit = {
  _id: "chatbot",
  avatar: "/images/botai.png",
  fullname: "ChatGPT-Plus",
  status: true,
};
const initState: { person: PserSonChating } = {
  person: personInit,
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
  },
});
export default PersonSlice.reducer;
export const { updatePerson, updatePersonStatus } = PersonSlice.actions;

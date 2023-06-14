import { createSlice } from "@reduxjs/toolkit";
export interface PserSonChating {
  _id: string;
  avatar: string;
  fullname: string;
  status: boolean;
}
const initState: { person: PserSonChating } = {
  person: {
    _id: "chatbot",
    avatar: "/images/botai.png",
    fullname: "ChatGPT-Plus",
    status: true,
  },
};
const PersonSlice = createSlice({
  name: "person",
  initialState: initState,
  reducers: {
    updatePerson(state, action) {
      state.person = action.payload;
    },
  },
});
export default PersonSlice.reducer;
export const { updatePerson } = PersonSlice.actions;

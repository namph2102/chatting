import { createSlice } from "@reduxjs/toolkit";
const SpotifySlice = createSlice({
  name: "spotify",
  initialState: {
    isOpenSoptify: false,
    key: "",
    type: "song",
  },
  reducers: {
    updateStatusModalSpotify(state, action) {
      if (!action.payload) {
        state.isOpenSoptify = !state.isOpenSoptify;
      } else {
        state.isOpenSoptify = action.payload;
      }
    },
    updateLinkSpotify(state, action) {
      state.key = action.payload.key;
      state.type = action.payload.type;
    },
  },
});
export default SpotifySlice.reducer;
export const { updateStatusModalSpotify, updateLinkSpotify } =
  SpotifySlice.actions;

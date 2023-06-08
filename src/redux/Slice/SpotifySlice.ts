import { createSlice } from "@reduxjs/toolkit";
const SpotifySlice = createSlice({
  name: "spotify",
  initialState: {
    isOpenSoptify: false,
    isLink: "",
    type: "album",
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
      state.isLink = action.payload;
    },
  },
});
export default SpotifySlice.reducer;
export const { updateStatusModalSpotify, updateLinkSpotify } =
  SpotifySlice.actions;

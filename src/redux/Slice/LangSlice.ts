import { createSlice } from "@reduxjs/toolkit";
const listLanguage = [
  {
    flag: "/images/flagvi.png",
    country: "Việt Nam",
    code: "vi",
    id: "vietnamenumberone",
  },
  {
    flag: "/images/flagen.png",
    country: "English",
    code: "en",
    id: "232323dsasadsadsa",
  },
];
const LanguageSlice = createSlice({
  name: "language",
  initialState: {
    listLanguage,
    languageCode: "vi",
  },
  reducers: {
    updateLanguage(state, action: { payload: string }) {
      state.languageCode = action.payload;
    },
  },
});
export default LanguageSlice.reducer;
export const { updateLanguage } = LanguageSlice.actions;

import { configureStore } from "@reduxjs/toolkit";
import AccountSlice from "./Slice/AccountSlice";
import SpotifySlice from "./Slice/SpotifySlice";
import ChatPersonSlice from "./Slice/ChatPersonSlice";
import SidebarSlice from "./Slice/SidebarSlice";
import LangSlice from "./Slice/LangSlice";

export const store = configureStore({
  reducer: {
    userStore: AccountSlice,
    spotifyStore: SpotifySlice,
    personStore: ChatPersonSlice,
    sidebarStore: SidebarSlice,
    languageStore: LangSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

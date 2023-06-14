import { configureStore } from "@reduxjs/toolkit";
import AccountSlice from "./Slice/AccountSlice";
import SpotifySlice from "./Slice/SpotifySlice";
import ChatPersonSlice from "./Slice/ChatPersonSlice";

export const store = configureStore({
  reducer: {
    userStore: AccountSlice,
    spotifyStore: SpotifySlice,
    personStore: ChatPersonSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

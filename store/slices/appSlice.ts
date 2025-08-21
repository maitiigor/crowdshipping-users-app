import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
  isReady: boolean;
  theme: "light" | "dark" | "system";
}

const initialState: AppState = {
  isReady: false,
  theme: "system",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setReady(state, action: PayloadAction<boolean>) {
      state.isReady = action.payload;
    },
    setTheme(state, action: PayloadAction<AppState["theme"]>) {
      state.theme = action.payload;
    },
  },
});

export const { setReady, setTheme } = appSlice.actions;
export default appSlice.reducer;

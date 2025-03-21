import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  accessToken: string | null;
  refreshToken: string | null;
  uid: string | null;
}

const initialState: UserState = {
  accessToken: null,
  refreshToken: null,
  uid: null,
};

export const authSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setAuth: (state, action) => {
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        uid: action.payload.uid,
      };
    },
    resetAuth: (state) => {
      return {
        accessToken: null,
        refreshToken: null,
        uid: null,
      };
    },
    setAccessToken: (state, action) => ({
      ...state,
      accessToken: action.payload,
    }),
  },
});

export const { setAuth, resetAuth, setAccessToken } = authSlice.actions;

export default authSlice.reducer;

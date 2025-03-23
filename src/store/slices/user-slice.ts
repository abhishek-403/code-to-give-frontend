import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  displayName: string | null;
  profileImage: string | null;
  email: string | null;
  uid: string | null;
  _id: string | null;
}

const initialState: UserState = {
  displayName: null,
  profileImage: null,
  email: null,
  uid: null,
  _id: null,
};

export const userSlice = createSlice({
  name: "userDetails",
  initialState: initialState,
  reducers: {
    setUserDetails: (state, action) => {
      return {
        ...state,
        displayName: action.payload.displayName,
        profileImage: action.payload.profileImage,
        email: action.payload.email,
        uid: action.payload.uid,
        _id: action.payload._id,
      };
    },
    resetUserDetails: (_) => {
      return {
        profileImage: null,
        displayName: null,
        email: null,
        uid: null,
        _id: null,
      };
    },
    setAccessToken: (state, action) => ({
      ...state,
      accessToken: action.payload,
    }),
  },
});

export const { setUserDetails, resetUserDetails, setAccessToken } =
  userSlice.actions;

export default userSlice.reducer;

import { UserRole } from "@/lib/constants/server-constants";
import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  displayName: string | null;
  profileImage: string | null;
  email: string | null;
  uid: string | null;
  role: UserRole | UserRole.USER;
  _id: string | null;
  volunteeringInterests?: string[];
}

const initialState: UserState = {
  displayName: null,
  profileImage: null,
  email: null,
  role: UserRole.USER,
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
        role: action.payload.role,
        uid: action.payload.uid,
        _id: action.payload._id,
        // volunteeringInterests: action.payload.volunteeringInterests?.map(
        //   (domain: any) => ({
        //     label: domain.name,
        //     value: domain._id,
        //   })
        // ),
        volunteeringInterests: action.payload.volunteeringInterests?.map(
          (domain: any) => domain._id
        ),
      };
    },
    resetUserDetails: (_) => {
      return {
        role: UserRole.USER,
        profileImage: null,
        displayName: null,
        email: null,
        uid: null,
        _id: null,
        volunteeringInterests: [],
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

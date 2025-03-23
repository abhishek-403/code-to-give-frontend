import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { useDispatch, useSelector, useStore } from "react-redux";

import userReducer from "./slices/user-slice";
const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

setupListeners(store.dispatch);

export { store };

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

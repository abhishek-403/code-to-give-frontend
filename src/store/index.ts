import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { useDispatch, useSelector, useStore } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import eventsReducer from "./slices/evet-slice";
import userReducer from "./slices/user-slice";

const eventPersistConfig = {
  key: "eventDetails",
  storage,
};
const rootReducer = combineReducers({
  user: userReducer,
  eventDetails: persistReducer(eventPersistConfig, eventsReducer),
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store); // Persistor instance

setupListeners(store.dispatch);

export { persistor, store };

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

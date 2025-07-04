import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../utils/Auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

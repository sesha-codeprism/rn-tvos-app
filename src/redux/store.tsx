import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./language_slice";

export const store = configureStore({
  reducer: {
    language: languageReducer,
  },
});

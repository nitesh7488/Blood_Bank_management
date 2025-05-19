import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice"; // Note the renamed import

const store = configureStore({
  reducer: {
    auth: authReducer, // Using the reducer directly
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable if you have non-serializable values
      immutableCheck: true, // Helps catch state mutations
    }),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools only in development
});

// Optional: Add store persistence example
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (err) {
    // Handle errors
  }
};

// Persist state on changes
store.subscribe(() => {
  saveState(store.getState());
});

export default store;
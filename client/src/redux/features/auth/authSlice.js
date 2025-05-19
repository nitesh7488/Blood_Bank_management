import { createSlice } from "@reduxjs/toolkit";
import { getCurrentUser, userLogin, userRegister } from "./authActions";

const token = localStorage.getItem("token") || null;

const initialState = {
  loading: false,
  user: null,
  token,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    // Common pending/rejected handlers
    const pendingHandler = (state) => {
      state.loading = true;
      state.error = null;
    };

    const rejectedHandler = (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    };

    // login user
    builder.addCase(userLogin.pending, pendingHandler);
    builder.addCase(userLogin.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload?.user || payload?.data?.user || payload;
      state.token = payload?.token || payload?.data?.token;
      state.error = null;
    });
    builder.addCase(userLogin.rejected, rejectedHandler);

    // REGISTER user
    builder.addCase(userRegister.pending, pendingHandler);
    builder.addCase(userRegister.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload?.user || payload?.data?.user || payload;
      state.error = null;
    });
    builder.addCase(userRegister.rejected, rejectedHandler);

    // CURRENT user
    builder.addCase(getCurrentUser.pending, pendingHandler);
    builder.addCase(getCurrentUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload?.user || payload?.data?.user || payload;
      state.error = null;
    });
    builder.addCase(getCurrentUser.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      state.token = null; // Clear token if current user request fails
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
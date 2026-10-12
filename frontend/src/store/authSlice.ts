import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import * as api from "@/lib/api";
import type { FieldError, User } from "@/lib/api";
import { readToken, writeToken } from "@/lib/session";

export type AuthError = {
  message: string;
  details: FieldError[];
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
};

function toAuthError(err: unknown): AuthError {
  if (err instanceof api.ApiError) {
    return { message: err.message, details: err.details };
  }
  return { message: "Something went wrong. Please try again.", details: [] };
}

export const handleRestoreSession = createAsyncThunk("auth/restoreSession", async () => {
  const saved = readToken();
  if (!saved) return null;

  try {
    const data = await api.getCurrentUser(saved);
    return { user: data.user, token: saved };
  } catch {
    writeToken(null);
    return null;
  }
});

export const handleLogin = createAsyncThunk<
  api.AuthResponse,
  { email: string; password: string },
  { rejectValue: AuthError }
>("auth/login", async (input, { rejectWithValue }) => {
  try {
    const data = await api.login(input);
    writeToken(data.token);
    return data;
  } catch (err) {
    return rejectWithValue(toAuthError(err));
  }
});

export const handleSignup = createAsyncThunk<
  api.AuthResponse,
  { name: string; email: string; password: string },
  { rejectValue: AuthError }
>("auth/signup", async (input, { rejectWithValue }) => {
  try {
    const data = await api.signup(input);
    writeToken(data.token);
    return data;
  } catch (err) {
    return rejectWithValue(toAuthError(err));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedOut(state) {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    const startSession = (
      state: AuthState,
      action: PayloadAction<api.AuthResponse>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    };

    builder
      .addCase(handleRestoreSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
        state.loading = false;
      })
      .addCase(handleRestoreSession.rejected, (state) => {
        state.loading = false;
      })
      .addCase(handleLogin.fulfilled, startSession)
      .addCase(handleSignup.fulfilled, startSession);
  },
});

export const { loggedOut } = authSlice.actions;

export const handleLogout = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
  writeToken(null);
  dispatch(loggedOut());
});

export default authSlice.reducer;

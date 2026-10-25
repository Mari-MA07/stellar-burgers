import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { setCookie, deleteCookie } from '../../utils/cookie';

import type { TLoginData, TRegisterData } from '@api';
import type { TUser } from '@utils-types';

export const loginUser = createAsyncThunk('user/login', async (data: TLoginData) => {
  const res = await loginUserApi(data);
  setCookie('accessToken', res.accessToken);
  localStorage.setItem('refreshToken', res.refreshToken);
  return res.user;
});

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const getUser = createAsyncThunk('user/getUser', async () => {
  const res = await getUserApi();
  return res.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email: string) => await forgotPasswordApi({ email })
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) => await resetPasswordApi(data)
);

type TUserState = {
  user: TUser | null;
  isAuth: boolean;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuth: false,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuth = true;
      state.isAuthChecked = true;
      state.user = action.payload;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? 'Ошибка входа';
      state.isAuthChecked = true;
    });

    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuth = true;
      state.isAuthChecked = true;
      state.user = action.payload;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? 'Ошибка регистрации';
      state.isAuthChecked = true;
    });

    builder.addCase(getUser.fulfilled, (state, action) => {
      state.isAuth = true;
      state.isAuthChecked = true;
      state.user = action.payload;
    });
    builder.addCase(getUser.rejected, (state) => {
      state.isAuth = false;
      state.isAuthChecked = true;
      state.user = null;
    });

    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isAuth = false;
      state.user = null;
    });

    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.error = action.error.message ?? 'Ошибка восстановления пароля';
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.error = action.error.message ?? 'Ошибка сброса пароля';
    });
  },
});

export const { setAuthChecked } = userSlice.actions;
export const userReducer = userSlice.reducer;

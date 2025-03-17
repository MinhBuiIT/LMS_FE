import { IUser } from '@/src/@types/user';
import { createSlice } from '@reduxjs/toolkit';

type TAuthState = {
  token: string;
  user: IUser | null;
  accessToken?: string;
  isAuth: boolean;
};

const initialState: TAuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '',
  user: null,
  accessToken: '',
  isAuth: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user_id', JSON.stringify(action.payload.user));
    },
    verifyEmail: (state, action) => {
      state.token = '';
    },
    loginUser: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuth = true;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    setAuthenticated: (state, action) => {
      state.user = action.payload;
      state.isAuth = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    setUnauthenticated: (state) => {
      state.user = null;
      state.isAuth = false;
      localStorage.removeItem('user');
    },
    updateUserInfo: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    }
  }
});

export const { registerUser, verifyEmail, loginUser, setAuthenticated, setUnauthenticated, updateUserInfo } =
  authSlice.actions;

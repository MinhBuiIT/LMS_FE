import {
  LoginBody,
  LoginResponse,
  RegisterBody,
  RegisterResponse,
  ResendVerifyEmailResponse,
  ResponseType,
  SocialLoginBody
} from '@/src/@types/api';
import { loginUser, registerUser, setUnauthenticated, verifyEmail } from '../slice/authSlice';
import { baseApi } from './baseApi';
import { baseAuthApi } from './baseAuthApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<ResponseType<RegisterResponse>, RegisterBody>({
      query: (body) => ({
        url: 'auth/register',
        method: 'POST',
        body
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        //Do Something
        try {
          const response = await queryFulfilled;
          const data = response.data.data;
          dispatch(registerUser(data));
        } catch (error) {
          console.log(error);
        }
      }
    }),
    verifyEmail: builder.mutation<ResponseType<null>, { token: string; code: string }>({
      query: ({ token, code }) => ({
        url: 'auth/verify-email',
        method: 'POST',
        body: { token, code }
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        //Do Something
        try {
          await queryFulfilled;

          dispatch(verifyEmail(null));
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } catch (error) {
          console.log(error);
        }
      }
    }),
    resendVerifyEmail: builder.mutation<ResponseType<ResendVerifyEmailResponse>, { email: string }>({
      query: ({ email }) => ({
        url: 'auth/resend-verify-email',
        method: 'POST',
        body: { email }
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        //Do Something
        try {
          const response = await queryFulfilled;
          const data = response.data.data;
          dispatch(registerUser(data));
        } catch (error) {
          console.log(error);
        }
      }
    }),
    loginUser: builder.mutation<ResponseType<LoginResponse>, LoginBody>({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        //Do Something
        try {
          const response = await queryFulfilled;

          const data = response.data.data;
          dispatch(loginUser({ user: data.user, accessToken: data.accessToken }));
        } catch (error) {
          console.log(error);
        }
      }
    }),
    forgotPasswordUser: builder.mutation<ResponseType<null>, { email: string }>({
      query: ({ email }) => ({
        url: 'auth/forgot-password',
        method: 'POST',
        body: { email }
      })
    }),
    resetPasswordUser: builder.mutation<ResponseType<null>, { newPassword: string; token: string }>({
      query: ({ newPassword, token }) => ({
        url: 'auth/reset-password',
        method: 'POST',
        body: { newPassword, token }
      })
    }),
    socialLoginUser: builder.mutation<ResponseType<LoginResponse>, SocialLoginBody>({
      query: (body) => ({
        url: 'auth/social-login',
        method: 'POST',
        body
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        //Do Something
        try {
          const response = await queryFulfilled;

          const data = response.data.data;
          dispatch(loginUser({ user: data.user, accessToken: data.accessToken }));
        } catch (error) {
          console.log(error);
        }
      }
    })
  })
});

export const authedApi = baseAuthApi.injectEndpoints({
  endpoints: (builder) => ({
    logoutUser: builder.mutation<ResponseType<null>, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST'
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        //Do Something
        try {
          await queryFulfilled;
          console.log('Logout Success');

          dispatch(setUnauthenticated());
        } catch (error) {
          console.log(error);
        }
      }
    })
  })
});

export const {
  useRegisterUserMutation,
  useVerifyEmailMutation,
  useLoginUserMutation,
  useResendVerifyEmailMutation,
  useForgotPasswordUserMutation,
  useResetPasswordUserMutation,
  useSocialLoginUserMutation
} = authApi;

export const { useLogoutUserMutation } = authedApi;

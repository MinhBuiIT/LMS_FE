import { isUnauthorizedResponseError } from '@/src/utils/predicate-type';
import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { setUnauthenticated } from '../../slice/authSlice';
import { RootState, store } from '../../store';

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: 'include' as const,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    let userId = state.auth.user?._id;
    if (typeof window !== 'undefined') {
      userId = userId || JSON.parse(localStorage.getItem('user') || '{}')?._id;
    }
    if (userId) {
      headers.set('client-id', userId);
    }
    return headers;
  }
});

export const baseQueryWithReAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);
  const error = result.error;
  if (error && isUnauthorizedResponseError(error)) {
    const message = error?.data?.message;
    if (message === 'Unauthorized') {
      //Refresh Token
      try {
        await baseQuery(
          {
            url: 'auth/refresh-token',
            method: 'POST'
          },
          api,
          extraOptions
        );

        //Retry the original request
        result = await baseQuery(args, api, extraOptions);
      } catch (error: any) {
        store.dispatch(setUnauthenticated());
      }
    } else {
      store.dispatch(setUnauthenticated());
    }
  }
  return result;
};

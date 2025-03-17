import { ResponseType } from '@/src/@types/api';
import { IUser } from '@/src/@types/user';
import { createApi } from '@reduxjs/toolkit/query/react';
import { setAuthenticated } from '../slice/authSlice';
import { baseQueryWithReAuth } from './reauth';

//Define Base API For RTK Query
export const baseAuthApi = createApi({
  reducerPath: 'baseAuthApi',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getMeApi: builder.query<ResponseType<IUser>, void>({
      query: () => ({
        url: 'user/info',
        method: 'GET'
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        //Do Something
        try {
          const response = await queryFulfilled;

          const data = response.data.data;
          const user = {
            _id: data._id,
            email: data.email,
            name: data.name,
            role: data.role,
            avatar: data.avatar,
            courses: data.courses
          };
          dispatch(setAuthenticated(user));
        } catch (error) {
          const errorRes = (error as any).error;
          console.log('ErrorProfile', errorRes);
        }
      }
    })
  })
});

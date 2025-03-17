import { ResponseType } from '@/src/@types/api';
import { IUser } from '@/src/@types/user';
import { updateUserInfo } from '../slice/authSlice';
import { baseAuthApi } from './baseAuthApi';

const userApi = baseAuthApi.injectEndpoints({
  endpoints: (build) => ({
    updateAvatarApi: build.mutation<ResponseType<IUser>, { avatar: string }>({
      query: ({ avatar }) => ({
        url: 'user/upload-avatar',
        method: 'PUT',
        body: { avatar }
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const response = await queryFulfilled;
          const data = response.data.data;

          dispatch(updateUserInfo(data));
        } catch (error) {
          console.log(error);
        }
      }
    }),
    updateUserInfoApi: build.mutation<ResponseType<IUser>, { email: string; name: string }>({
      query: ({ email, name }) => ({
        url: 'user/update-info',
        method: 'PUT',
        body: { email, name }
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const response = await queryFulfilled;
          const data = response.data.data;

          dispatch(updateUserInfo(data));
        } catch (error) {
          console.log(error);
        }
      }
    }),
    changePasswordApi: build.mutation<ResponseType<null>, { oldPassword: string; newPassword: string }>({
      query: ({ oldPassword, newPassword }) => ({
        url: 'user/change-password',
        method: 'PUT',
        body: { oldPassword, newPassword }
      })
    }),
    userInfoByEmailApi: build.mutation<ResponseType<IUser>, { email: string }>({
      query: ({ email }) => ({
        url: 'user/info-by-email',
        method: 'POST',
        body: { email }
      })
    }),
    addUserIntoCourseApi: build.mutation<ResponseType<null>, { userId: string; courseId: string }>({
      query: ({ userId, courseId }) => ({
        url: 'user/add-course',
        method: 'POST',
        body: { userId, courseId }
      })
    }),
    getAllUsersByAdminApi: build.query<ResponseType<IUser[]>, void>({
      query: () => ({
        url: 'user/all',
        method: 'GET'
      })
    }),
    changeDisableUserApi: build.mutation<ResponseType<null>, { userId: string }>({
      query: ({ userId }) => ({
        url: `user/disable/${userId}`,
        method: 'PATCH'
      })
    })
  })
});

export const {
  useUpdateAvatarApiMutation,
  useUpdateUserInfoApiMutation,
  useChangePasswordApiMutation,
  useUserInfoByEmailApiMutation,
  useAddUserIntoCourseApiMutation,
  useGetAllUsersByAdminApiQuery,
  useChangeDisableUserApiMutation
} = userApi;

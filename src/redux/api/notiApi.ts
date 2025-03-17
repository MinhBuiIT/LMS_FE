import { ResponseType } from '@/src/@types/api';
import { TNoti } from '@/src/@types/noti';
import { baseAuthApi } from './baseAuthApi';

const notiApi = baseAuthApi.injectEndpoints({
  endpoints: (build) => ({
    getNotiApi: build.query<
      ResponseType<{ notiList: TNoti[]; total: number; page: number; limit: number }>,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: `/notification?page=${page}&limit=${limit}`,
        method: 'GET'
      })
    }),
    updateStatusNotiApi: build.mutation<ResponseType<null>, { id: string }>({
      query: ({ id }) => ({
        url: `/notification/${id}`,
        method: 'PATCH'
      })
    }),
    updateStatusAllNotiApi: build.mutation<ResponseType<null>, void>({
      query: () => ({
        url: `/notification/all`,
        method: 'PATCH'
      })
    })
  })
});

export const { useGetNotiApiQuery, useUpdateStatusAllNotiApiMutation, useUpdateStatusNotiApiMutation } = notiApi;

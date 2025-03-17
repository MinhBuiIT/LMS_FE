import { ResponseType } from '@/src/@types/api';
import { TLayout } from '@/src/@types/layout';
import { baseAuthApi } from './baseAuthApi';

const layoutApi = baseAuthApi.injectEndpoints({
  endpoints: (build) => ({
    getLayout: build.query<ResponseType<TLayout>, { type: string }>({
      query: ({ type }) => ({
        url: `/layout/${type}`,
        method: 'GET'
      })
    }),
    updateLayout: build.mutation<ResponseType<TLayout>, { data: any }>({
      query: ({ data }) => ({
        url: '/layout',
        method: 'PUT',
        body: data
      })
    })
  })
});

export const { useGetLayoutQuery, useUpdateLayoutMutation } = layoutApi;

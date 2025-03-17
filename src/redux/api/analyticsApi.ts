import { ResponseType } from '@/src/@types/api';
import { baseAuthApi } from './baseAuthApi';

const analyticsApi = baseAuthApi.injectEndpoints({
  endpoints: (build) => ({
    getCourseAnalyticApi: build.query<
      ResponseType<
        {
          month: string;
          count: number;
        }[]
      >,
      void
    >({
      query: () => ({
        url: 'analytics/course',
        method: 'GET'
      })
    }),
    getUserAnalyticApi: build.query<
      ResponseType<
        {
          month: string;
          count: number;
        }[]
      >,
      void
    >({
      query: () => ({
        url: 'analytics/user',
        method: 'GET'
      })
    }),
    getOrderAnalyticApi: build.query<
      ResponseType<
        {
          month: string;
          count: number;
        }[]
      >,
      void
    >({
      query: () => ({
        url: 'analytics/order',
        method: 'GET'
      })
    })
  })
});

export const { useGetCourseAnalyticApiQuery, useGetOrderAnalyticApiQuery, useGetUserAnalyticApiQuery } = analyticsApi;

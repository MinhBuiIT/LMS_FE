import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

//Define Base API For RTK Query
export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL, credentials: 'include' as const }),
  endpoints: () => ({})
});

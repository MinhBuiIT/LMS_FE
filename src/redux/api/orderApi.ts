import { ResponseType } from '@/src/@types/api';
import { baseAuthApi } from './baseAuthApi';

const orderApi = baseAuthApi.injectEndpoints({
  endpoints: (build) => ({
    getAllOrderApi: build.query<ResponseType<any>, void>({
      query: () => ({
        url: 'order/all',
        method: 'GET'
      })
    }),
    getPublishKeyApi: build.query<ResponseType<{ publishKey: string }>, void>({
      query: () => ({
        url: 'order/stripe-key',
        method: 'GET'
      })
    }),
    newPaymentStripeApi: build.mutation<ResponseType<{ client_secret: string }>, { amount: number }>({
      query: (body) => ({
        url: 'order/stripe-payment',
        method: 'POST',
        body
      })
    }),
    createOrderApi: build.mutation<ResponseType<any>, { courseId: string; paymentInfo: any; price: number }>({
      query: (body) => ({
        url: 'order',
        method: 'POST',
        body
      })
    })
  })
});

export const {
  useGetAllOrderApiQuery,
  useGetPublishKeyApiQuery,
  useNewPaymentStripeApiMutation,
  useCreateOrderApiMutation
} = orderApi;

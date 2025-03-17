import { ResponseType } from '@/src/@types/api';
import { TReview } from '@/src/@types/review';
import { baseApi } from './baseApi';
import { baseAuthApi } from './baseAuthApi';

type TReviewOfCourse = {
  reviews: TReview[];
  total_review: number;
  total_page: number;
  current_page: number;
  limit: number;
};
const reviewNoAuthApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getReviewsOfCourse: build.query<ResponseType<TReviewOfCourse>, { courseId: string; page: number; limit: number }>({
      query: ({ courseId, page, limit }) => ({
        url: `review/course/${courseId}?page=${page}&limit=${limit}`,
        method: 'GET'
      })
    })
  })
});

const reviewAuthApi = baseAuthApi.injectEndpoints({
  endpoints: (build) => ({
    addReview: build.mutation<ResponseType<any>, { course: string; rating: number; comment: string }>({
      query: ({ course, rating, comment }) => ({
        url: `review`,
        method: 'POST',
        body: { course, rating, comment }
      })
    }),
    replyReview: build.mutation<ResponseType<any>, { reviewId: string; text: string; courseId: string }>({
      query: ({ reviewId, text, courseId }) => ({
        url: `review/reply`,
        method: 'POST',
        body: { reviewId, text, courseId }
      })
    })
  })
});

export const { useGetReviewsOfCourseQuery } = reviewNoAuthApi;
export const { useAddReviewMutation, useReplyReviewMutation } = reviewAuthApi;

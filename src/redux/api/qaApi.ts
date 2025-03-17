import { ResponseType } from '@/src/@types/api';
import { TQAItem } from '@/src/@types/qa';
import { baseAuthApi } from './baseAuthApi';

const qaApi = baseAuthApi.injectEndpoints({
  endpoints: (build) => ({
    getCommentListApi: build.query<
      ResponseType<{
        limit: number;
        page: number;
        qa_count: number;
        qa_list: TQAItem[];
      }>,
      { lectureId: string; limit: number; page: number }
    >({
      query: ({ lectureId, limit, page }) => ({
        url: `/qa/list/${lectureId}?limit=${limit}&page=${page}`,
        method: 'GET'
      }),
      keepUnusedDataFor: 0
    }),
    createCommentApi: build.mutation<
      ResponseType<any>,
      { courseDataId: string; qaText: string; qaParent: string | null }
    >({
      query: ({ courseDataId, qaText, qaParent }) => {
        return {
          url: `/qa`,
          method: 'POST',
          body: { courseDataId, qaText, qaParent }
        };
      }
    }),
    getCommentChildApi: build.query<ResponseType<any>, { qaParentId: string }>({
      query: ({ qaParentId }) => ({
        url: `/qa/child/${qaParentId}`,
        method: 'GET'
      }),
      keepUnusedDataFor: 0
    }),
    deleteCommentApi: build.mutation<ResponseType<any>, { qaId: string }>({
      query: ({ qaId }) => ({
        url: `/qa/${qaId}`,
        method: 'DELETE'
      })
    })
  })
});

export const {
  useGetCommentListApiQuery,
  useCreateCommentApiMutation,
  useGetCommentChildApiQuery,
  useDeleteCommentApiMutation
} = qaApi;

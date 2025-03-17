import { ResponseType } from '@/src/@types/api';
import { TCourseBody, TCourseData, TCourseDetail, TCourseFull } from '@/src/@types/course';
import { TReview } from '@/src/@types/review';
import { baseApi } from './baseApi';
import { baseAuthApi } from './baseAuthApi';

const courseApi = baseAuthApi.injectEndpoints({
  endpoints: (build) => ({
    generationUrlVideoApi: build.mutation<ResponseType<{ otp: string; playbackInfo: string }>, { videoId: string }>({
      query: ({ videoId }) => ({
        url: 'course/generate-url',
        method: 'POST',
        body: { videoId }
      })
    }),

    createCourseApi: build.mutation<ResponseType<null>, TCourseBody>({
      query: (data) => ({
        url: 'course',
        method: 'POST',
        body: data
      })
    }),
    getAllCourseAdminApi: build.query<
      ResponseType<{ courses: TCourseFull[]; page: number; limit: number; total: number }>,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: `course/all?page=${page}&limit=${limit}`,
        method: 'GET'
      })
    }),
    changeStatusCourseApi: build.mutation<ResponseType<null>, { id: string }>({
      query: ({ id }) => ({
        url: `course/change-status/${id}`,
        method: 'POST'
      })
    }),
    getCourseDetailByIdApi: build.query<ResponseType<TCourseDetail>, { id: string }>({
      query: ({ id }) => ({
        url: `course/${id}`,
        method: 'GET'
      })
    }),
    updateCourseApi: build.mutation<ResponseType<null>, { id: string; data: Pick<TCourseBody, 'courseInfo'> }>({
      query: ({ id, data }) => ({
        url: `course/${id}`,
        method: 'PUT',
        body: data.courseInfo
      })
    }),
    videoInfoApi: build.mutation<ResponseType<any>, { videoId: string }>({
      query: ({ videoId }) => ({
        url: `course/video-info`,
        method: 'POST',
        body: { videoId }
      })
    }),
    getListCourses: build.query<
      ResponseType<{ courses: TCourseFull[]; limit: number; page: number; total: number }>,
      { page: number; limit: number; category?: string; search?: string }
    >({
      query: ({ page, limit, category, search }) => {
        let url = `course/list?page=${page}&limit=${limit}`;
        if (category) {
          url += `&cate=${category}`;
        }
        if (search) {
          url += `&search=${search}`;
        }
        return {
          url,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0
    }),
    uploadVieoApi: build.mutation<
      ResponseType<{ videoUrl: string; videoId: string; duration: number; playBackUrl: string }>,
      FormData
    >({
      query: (data) => ({
        url: 'course/upload-video',
        method: 'POST',
        body: data
      })
    }),
    deleteVideoApi: build.mutation<ResponseType<null>, { public_id: string[] }>({
      query: ({ public_id }) => ({
        url: `course/delete-video`,
        method: 'POST',
        body: { public_id }
      })
    }),
    getCourseDetailPurchased: build.query<ResponseType<TCourseDetail>, { id: string }>({
      query: ({ id }) => ({
        url: `course/purchased/${id}`,
        method: 'GET'
      })
    }),

    updateSectionCourseApi: build.mutation<ResponseType<null>, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `course/section/${id}`,
        method: 'PUT',
        body: data
      })
    }),
    changeLectureOrderApi: build.mutation<
      ResponseType<null>,
      {
        data: {
          courseId: string;
          sectionId: string;
          lectureOriginal: { id: string; order: number };
          lectureTarget: { id: string; order: number };
        };
      }
    >({
      query: ({ data }) => ({
        url: `course/lecture/change-order`,
        method: 'POST',
        body: data
      })
    }),
    addNewSectionApi: build.mutation<ResponseType<null>, { courseId: string; data: TCourseData }>({
      query: ({ courseId, data }) => ({
        url: `course/add-section/${courseId}`,
        method: 'POST',
        body: data
      })
    }),
    courseListPurchased: build.query<
      ResponseType<{ courses: TCourseFull[]; page: number; limit: number; total: number }>,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: `course/list-purchased?page=${page}&limit=${limit}`,
        method: 'GET'
      })
    })
  })
});

const courseNotAuthApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCourseNotPurchase: build.query<
      ResponseType<TCourseDetail & { top_reviews: TReview[]; countReviews: number }>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `course/not-purchased/${id}`,
        method: 'GET'
      })
    })
  })
});

export const {
  useGenerationUrlVideoApiMutation,
  useCreateCourseApiMutation,
  useGetAllCourseAdminApiQuery,
  useChangeStatusCourseApiMutation,
  useGetCourseDetailByIdApiQuery,
  useUpdateCourseApiMutation,
  useVideoInfoApiMutation,
  useGetListCoursesQuery,
  useUploadVieoApiMutation,
  useGetCourseDetailPurchasedQuery,
  useUpdateSectionCourseApiMutation,
  useChangeLectureOrderApiMutation,
  useAddNewSectionApiMutation,
  useDeleteVideoApiMutation,
  useCourseListPurchasedQuery
} = courseApi;

export const { useGetCourseNotPurchaseQuery } = courseNotAuthApi;

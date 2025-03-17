'use client';
import { TReview } from '@/src/@types/review';
import { IUser } from '@/src/@types/user';
import { getSocketContext } from '@/src/hoc/socket';
import { useAddReviewMutation, useGetReviewsOfCourseQuery } from '@/src/redux/api/reviewApi';
import { RootState } from '@/src/redux/store';
import { isBadRequestError, isUnauthorizedResponseError } from '@/src/utils/predicate-type';
import { Rating } from '@mui/material';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import userDefaultImg from '../../../public/user-avatar-default.jpg';
import Loading from '../loading';
import ReviewItem from '../review-item';

type TProps = {
  courseId: string;
  isEnrolled?: boolean;
};
const LIMIT = 5;
const ReviewList: FC<TProps> = ({ courseId, isEnrolled = false }) => {
  const { t } = useTranslation();
  const socket = getSocketContext();
  const { user } = useSelector((state: RootState) => state.auth);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState<number>(4);
  const [addReviewAction] = useAddReviewMutation();

  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetReviewsOfCourseQuery(
    { courseId, page, limit: LIMIT },
    { skip: !courseId, refetchOnMountOrArgChange: true }
  );
  const [reviewList, setReviewList] = useState<TReview[]>([]);

  const reviewData = data?.data;
  const reviews = reviewData?.reviews;

  const handleAddReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    if (!reviewText.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá');
      return;
    }
    if (rating < 1 || rating > 5) {
      toast.error('Đánh giá phải từ 1 đến 5');
      return;
    }
    addReviewAction({ course: courseId, rating, comment: reviewText })
      .unwrap()
      .then((res) => {
        const newReview = res.data;
        //console.log('res::', res);
        setReviewList([newReview, ...reviewList]);
        setReviewText('');
        setRating(4);
        socket?.emit('notification');
        toast.success(t('SendReview'));
      })
      .catch((err) => {
        if (isBadRequestError(err) || isUnauthorizedResponseError(err)) {
          toast.error(err.data.message);
        } else {
          toast.error(t('SendReviewFail'));
        }
      });
  };

  useEffect(() => {
    if (reviews) {
      setReviewList([...reviewList, ...reviews]);
    }
  }, [reviews]);

  useEffect(() => {
    if (socket) {
      socket.connect();
    }
    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  return (
    <div className="w-full">
      {isEnrolled && user?.role !== 'admin' && (
        <div className="flex items-start gap-3 pb-4 border-b border-gray-300 dark:border-gray-700">
          <Image
            src={user?.avatar?.url || userDefaultImg}
            alt={''}
            width={40}
            height={40}
            className="rounded-[50%] w-[40px] h-[40px]"
          />
          <div className="flex-1">
            <Rating
              name="half-rating"
              defaultValue={4}
              precision={0.5}
              sx={{ '& .MuiRating-icon': { color: 'unset' } }}
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue || 0);
              }}
            />
            <form className="w-full" onSubmit={handleAddReview}>
              <textarea
                placeholder="Write a comment..."
                className="w-full p-3 rounded-lg bg-gray-200/70 dark:bg-gray-800 resize-none"
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
                >
                  {t('Confirm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {reviewData && (
        <h3 className={`text-gray-700 ${isEnrolled ? 'dark:text-white mt-8' : ''} text-3xl font-semibold mb-8 `}>
          {reviewList.length} {t('Reviews')}
        </h3>
      )}
      {reviewList && reviewList.length === 0 && (
        <div className="text-gray-700 dark:text-white text-lg font-medium">{t('NoReview')}</div>
      )}
      <div>
        {reviewList.map((review) => {
          return (
            <ReviewItem
              review={review}
              key={review._id}
              className={`${isEnrolled ? 'dark:text-white' : ''} text-gray-600 `}
              user={user as IUser}
              showReply={true}
            />
          );
        })}

        {(reviewData?.current_page || 0) < (reviewData?.total_page || 0) && (
          <>
            {isLoading ? (
              <Loading />
            ) : (
              <button
                onClick={() => {
                  setPage((pre) => pre + 1);
                }}
                disabled={isLoading}
                className={`relative w-full inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white  focus:ring-4 focus:outline-none focus:ring-blue-300 ${
                  isEnrolled ? 'dark:text-white dark:focus:ring-blue-800' : ''
                }`}
              >
                <span
                  className={`relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white  rounded-md group-hover:bg-transparent ${
                    isEnrolled ? 'group-hover:dark:bg-transparent dark:bg-gray-900' : ''
                  }`}
                >
                  {t('SeeMore')}
                </span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewList;

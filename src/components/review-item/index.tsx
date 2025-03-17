'use client';
import { TReview } from '@/src/@types/review';
import { IUser } from '@/src/@types/user';
import { useReplyReviewMutation } from '@/src/redux/api/reviewApi';
import { isBadRequestError, isNotFoundRequestError, isUnauthorizedRequestError } from '@/src/utils/predicate-type';
import Image from 'next/image';
import { FC, FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import userDefault from '../../../public/user-avatar-default.jpg';
import Rating from '../rating';

type TProps = {
  review: TReview;
  className?: string;
  user?: IUser;
  showReply: boolean;
};
export const ReviewItem: FC<TProps> = ({ review, className, user, showReply }) => {
  const [replyReviewActive, setReplyReviewActive] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyAction] = useReplyReviewMutation();
  const [resReply, setResReply] = useState<any | null>(review.replies);

  const handleReplySubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    if (!replyText.trim()) {
      toast.error('Vui lòng nhập nội dung phản hồi');
      return;
    }
    replyAction({ courseId: review.course, reviewId: review._id, text: replyText })
      .unwrap()
      .then((res) => {
        setReplyReviewActive(null);
        setReplyText('');
        console.log('res::', res);

        setResReply(res.data);
        toast.success('Phản hồi đã được gửi');
      })
      .catch((err) => {
        if (isBadRequestError(err) || isNotFoundRequestError(err) || isUnauthorizedRequestError(err)) {
          toast.error(err.data.message);
        } else {
          toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
        }
      });
  };

  return (
    <div
      key={review._id}
      className={`[&:not(:last-child)]:mb-8 [&:not(:last-child)]:pb-4 [&:not(:last-child)]:border-b border-gray-400 dark:border-gray-700 ${
        className ? className : 'text-black dark:text-white'
      }`}
    >
      <div className="w-full">
        <Rating rating={review.rating} />
        <div className="text-[16px] font-medium mt-4">{review.comment}</div>
        <div className="mt-4 flex items-center">
          <Image
            src={review?.user?.avatar?.url || userDefault}
            alt="user"
            width={80}
            height={80}
            className="rounded-[50%] object-cover w-[36px] h-[36px]"
          />
          <cite className="ps-3 font-medium ">{review.user.name}</cite>
        </div>
        {showReply && (
          <>
            {user && user.role === 'admin' && resReply === null && (
              <>
                <button
                  className="text-[#37b668] text-base font-Poppins mt-4"
                  onClick={() => setReplyReviewActive(review._id)}
                >
                  Phản hồi
                </button>
                {replyReviewActive === review._id && (
                  <div className="flex items-start gap-3 pb-4 mt-8">
                    <Image
                      src={user?.avatar?.url || userDefault}
                      alt={''}
                      width={40}
                      height={40}
                      className="rounded-[50%] w-[40px] h-[40px]"
                    />
                    <form className="w-full" onSubmit={handleReplySubmit}>
                      <textarea
                        placeholder="Write a comment..."
                        className="w-full p-3 rounded-lg bg-gray-200/70 dark:bg-gray-800 resize-none"
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <div className="flex justify-end mt-2 items-center gap-5">
                        <button
                          type="button"
                          className="text-gray-500 dark:text-gray-400"
                          onClick={() => setReplyReviewActive(null)}
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
                        >
                          Xác Nhận
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </>
            )}
            {resReply && (
              <div className="w-full ms-7 mt-8">
                <div className="text-[16px] font-medium mt-4">{resReply.text}</div>
                <div className="mt-4 flex items-center">
                  <Image
                    src={resReply?.user?.avatar?.url || userDefault}
                    alt="user"
                    width={80}
                    height={80}
                    className="rounded-[50%] object-cover w-[36px] h-[36px]"
                  />
                  <cite className="ps-3 font-medium ">{resReply?.user.name}</cite>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewItem;

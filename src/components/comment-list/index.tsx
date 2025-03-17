'use client';

import { TQAItem } from '@/src/@types/qa';
import { getSocketContext } from '@/src/hoc/socket';
import { useCreateCommentApiMutation, useGetCommentListApiQuery } from '@/src/redux/api/qaApi';
import { RootState } from '@/src/redux/store';
import { isBadRequestError, isUnauthorizedResponseError } from '@/src/utils/predicate-type';
import Image from 'next/image';
import { FC, FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import userDefaultImg from '../../../public/user-avatar-default.jpg';
import CommentItem from '../comment-item';
import Loading from '../loading';

type TProps = {
  lectureId: string;
};

const LIMIT = 3;
const CommentList: FC<TProps> = ({ lectureId }) => {
  const socket = getSocketContext();
  const [page, setPage] = useState(1);
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    data: commentRes,
    isLoading,
    refetch
  } = useGetCommentListApiQuery({ lectureId, limit: LIMIT, page }, { skip: !lectureId });
  const [createCommentAction, createCommentResult] = useCreateCommentApiMutation();
  const [commentText, setCommentText] = useState('');
  const [commentLs, setCommentLs] = useState<TQAItem[]>([]);
  const [replyCommentActive, setReplyCommentActive] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleRefreshComment = () => {
    setPage(1);
    setReplyCommentActive(null);
    refetch();
  };

  const handleSubmitComment = (
    e: FormEvent<HTMLFormElement>,
    text: string,
    resetText: () => void,
    qaParent: string | null
  ) => {
    e.preventDefault();

    if (text.trim().length === 0) return;
    createCommentAction({ courseDataId: lectureId, qaText: text, qaParent })
      .unwrap()
      .then((res) => {
        resetText();
        const newComment = res.data;
        if (user?.role !== 'admin') {
          socket?.emit('notification');
        }
        if (!qaParent) {
          setCommentLs((prev) => [newComment, ...prev]);
        }
        setReplyCommentActive(null);
      })
      .catch((err) => {
        if (isBadRequestError(err) || isUnauthorizedResponseError(err)) {
          toast.error(err.data.message);
        } else {
          toast.error('Something went wrong');
        }
      });
  };

  useEffect(() => {
    if (commentRes) {
      const qaList = commentRes?.data.qa_list as TQAItem[];
      if (page > 1) {
        setCommentLs((prev) => {
          const newCommentLs = [...prev];
          qaList.forEach((comment) => {
            if (!newCommentLs.find((c) => c._id === comment._id)) {
              newCommentLs.push(comment);
            }
          });
          return newCommentLs;
        });
      } else {
        setCommentLs(qaList);
      }
    }
  }, [commentRes, page]);

  useEffect(() => {
    if (lectureId) {
      setPage(1);
      setReplyCommentActive(null);
      setCommentLs([]);
    }
  }, [lectureId]);

  useEffect(() => {
    if (socket) {
      socket.connect();
    }
    return () => {
      socket?.disconnect();
    };
  }, []);

  return (
    <div className="mt-[40px] text-black dark:text-white font-Poppins pb-[64px] px-6">
      <div className="flex items-start gap-3 pb-4 border-b border-gray-300 dark:border-gray-700">
        <Image
          src={user?.avatar?.url || userDefaultImg}
          alt={''}
          width={40}
          height={40}
          className="rounded-[50%] w-[40px] h-[40px]"
        />
        <form
          className="w-full"
          onSubmit={(e) =>
            handleSubmitComment(
              e,
              commentText,
              () => {
                setCommentText('');
              },
              null
            )
          }
        >
          <textarea
            placeholder={`${t('WriteComment')}...`}
            className="w-full p-3 rounded-lg bg-gray-200/70 dark:bg-gray-800 resize-none"
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
            >
              {t('Comment')}
            </button>
          </div>
        </form>
      </div>

      <div className="w-full mt-[24px] flex flex-col gap-8">
        {isLoading ? (
          <Loading height="300px" />
        ) : (
          <>
            {commentLs.length > 0 ? (
              <>
                {commentLs.map((comment) => {
                  // const replyListByParent = replyList.find((reply) => reply[comment._id]);

                  return (
                    <div key={comment._id} className={`flex flex-col gap-3 `}>
                      <CommentItem
                        comment={comment}
                        setReplyCommentActive={setReplyCommentActive}
                        replyCommentActive={replyCommentActive}
                        user={user}
                        lectureId={lectureId}
                        handleRefreshComment={handleRefreshComment}
                        socket={socket}
                      />
                    </div>
                  );
                })}
                {commentRes && commentRes?.data.qa_count > commentLs.length && (
                  <button
                    type="button"
                    onClick={() => setPage((prev) => prev + 1)}
                    className={`relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 `}
                  >
                    <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent flex items-center gap-3 justify-center">
                      {isLoading ? (
                        <div role="status">
                          <div>
                            <svg
                              aria-hidden="true"
                              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                              />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                              />
                            </svg>
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <span>{t('SeeMore')}</span>
                      )}
                    </span>
                  </button>
                )}
              </>
            ) : (
              <div className="w-full h-[80px] flex items-center justify-center text-gray-600">{t('NoComment')}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentList;

/**
 * Fix chỗ nếu phản hồi xong và xóa comment(không có reload page) thì list comment bị mất
 *
 */

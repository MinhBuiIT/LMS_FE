'use client';
import { TQAItem } from '@/src/@types/qa';
import { IUser } from '@/src/@types/user';
import {
  useCreateCommentApiMutation,
  useDeleteCommentApiMutation,
  useGetCommentChildApiQuery
} from '@/src/redux/api/qaApi';
import { isBadRequestError, isUnauthorizedResponseError } from '@/src/utils/predicate-type';
import Image from 'next/image';
import { Dispatch, FC, FormEvent, SetStateAction, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FaCaretRight } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { format } from 'timeago.js';
import userDefaultImg from '../../../public/user-avatar-default.jpg';

type TProps = {
  comment: TQAItem;
  setReplyCommentActive: Dispatch<SetStateAction<string | null>>;
  replyCommentActive: string | null;
  user: IUser | null;
  replyUser?: IUser | null;
  lectureId: string;
  handleRefreshComment: () => void;
  handleRefreshParentComment?: () => void;
  socket: any;
};

const CommentItem: FC<TProps> = ({
  comment,
  setReplyCommentActive,
  replyCommentActive,
  user,
  replyUser,
  lectureId,
  handleRefreshComment,
  handleRefreshParentComment,
  socket
}) => {
  const { t } = useTranslation();
  const level = comment.qaLevel;
  const [commentText, setCommentText] = useState('');
  const [qaParentLoadMore, setQaParentLoadMore] = useState<string | null>(null);
  const [replyList, setReplyList] = useState<TQAItem[]>([]);
  const replyHaveLoadMore = useRef<string[]>([]);
  const [createCommentAction, createCommentResult] = useCreateCommentApiMutation();
  const [deleteCommentAction, deleteCommentResult] = useDeleteCommentApiMutation();

  const { data: qaChildsRes, refetch } = useGetCommentChildApiQuery(
    { qaParentId: qaParentLoadMore || '' },
    { refetchOnMountOrArgChange: true, skip: qaParentLoadMore === null }
  );

  const handleRefreshSuper = () => {
    handleRefreshParentComment && handleRefreshParentComment();
    handleRefreshComment();
  };

  const handleSubmitComment = (e: FormEvent<HTMLFormElement>, qaParent: string) => {
    e.preventDefault();

    if (commentText.trim().length === 0) return;
    createCommentAction({ courseDataId: lectureId, qaText: commentText, qaParent })
      .unwrap()
      .then((res) => {
        setCommentText('');
        setReplyCommentActive(null);
        const newComment = res.data;
        if (user?.role !== 'admin') {
          socket?.emit('notification');
        }
        setReplyList((prev) => [newComment, ...prev]);
      })
      .catch((err) => {
        if (isBadRequestError(err) || isUnauthorizedResponseError(err)) {
          toast.error(err.data.message);
        } else {
          toast.error('Something went wrong');
        }
      });
  };

  const handleDeleteComment = (qaId: string) => {
    deleteCommentAction({ qaId })
      .unwrap()
      .then(() => {
        handleRefreshSuper();
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
    if (qaChildsRes?.data && qaChildsRes.data.length > 0 && qaParentLoadMore !== null) {
      setReplyList((prev) => [...qaChildsRes.data]);
      setQaParentLoadMore(null);
    }
  }, [qaChildsRes, qaParentLoadMore]);

  return (
    <>
      <div
        className={`flex flex-col gap-3 mt-6 pb-2 border-b border-gray-300 dark:border-gray-700`}
        style={{ marginLeft: `${level * 20}px` }}
      >
        <div className="flex items-center gap-2">
          <Image
            src={comment.qaUser.avatar.url || userDefaultImg}
            alt={''}
            width={40}
            height={40}
            className="rounded-[50%] w-[40px] h-[40px]"
          />
          <div className="flex items-center gap-3 text-[14px]">
            <div className="flex items-center gap-1">
              <div className="font-semibold text-[#37b668]">{comment.qaUser.name}</div>
              {comment.qaUser?.role === 'admin' && <MdVerified size={18} color="#4dabf5" />}
            </div>
            {replyUser && (
              <>
                <FaCaretRight size={16} className="text-gray-600 dark:text-gray-50" />
                <div className="font-semibold text-[#37b668]">{replyUser.name}</div>
              </>
            )}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">{format(new Date(comment.createdAt), 'vi')}</div>
        </div>
        <div className="text-[15px] leading-8 font-Poppins text-black dark:text-white">{comment.qaText}</div>
        <div className="flex items-center text-[13px] gap-8">
          <button className="text-[#37b668]" onClick={() => setReplyCommentActive(comment._id)}>
            {t('Reply')}
          </button>
          {user?._id === comment.qaUser._id && (
            <button className="text-[#37b668]" onClick={() => handleDeleteComment(comment._id)}>
              {t('Delete')}
            </button>
          )}
          {comment?.qaChildCount && comment.qaChildCount > 0 ? (
            <button
              className="text-[#37b668]"
              onClick={() => {
                if (replyHaveLoadMore.current.includes(comment._id)) {
                  return;
                }
                setQaParentLoadMore(comment._id);
                replyHaveLoadMore.current.push(comment._id);
              }}
            >
              {comment.qaChildCount} {t('Answer')}
            </button>
          ) : null}
        </div>

        {replyCommentActive === comment._id && (
          <div className="flex items-start gap-3 ">
            <Image
              src={user?.avatar?.url || userDefaultImg}
              alt={''}
              width={40}
              height={40}
              className="rounded-[50%] w-[40px] h-[40px]"
            />
            <form className="w-full " onSubmit={(e) => handleSubmitComment(e, comment._id)}>
              <textarea
                placeholder="Write a comment..."
                className="w-full p-3 rounded-lg bg-gray-200/70 dark:bg-gray-800 resize-none"
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="flex justify-end mt-2 gap-4">
                <button
                  type="button"
                  className="text-gray-500 dark:text-gray-400"
                  onClick={() => setReplyCommentActive(null)}
                >
                  {t('Cancel')}
                </button>
                <button
                  type="submit"
                  className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
                >
                  {t('Comment')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      {replyList && replyList.length > 0
        ? replyList.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              setReplyCommentActive={setReplyCommentActive}
              replyCommentActive={replyCommentActive}
              user={user}
              replyUser={comment.qaUser as IUser}
              lectureId={lectureId}
              handleRefreshComment={handleRefreshComment}
              handleRefreshParentComment={() => {
                setReplyList([]);
                setQaParentLoadMore(null);
                replyHaveLoadMore.current = [];
              }}
              socket={socket}
            />
          ))
        : null}
    </>
  );
};

export default CommentItem;

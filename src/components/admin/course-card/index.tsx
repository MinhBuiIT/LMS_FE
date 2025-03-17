'use client';
import { TCourseFull } from '@/src/@types/course';
import { IUser } from '@/src/@types/user';
import { useChangeStatusCourseApiMutation } from '@/src/redux/api/courseApi';
import { useAddUserIntoCourseApiMutation, useUserInfoByEmailApiMutation } from '@/src/redux/api/userApi';
import { isBadRequestError, isUnauthorizedResponseError } from '@/src/utils/predicate-type';
import { Avatar, Box, Card, CardContent, CardMedia, Modal, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import { IoMdAddCircleOutline } from 'react-icons/io';
import userAvatarDefault from '../../../../public/user-avatar-default.jpg';
import Rating from '../../rating';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  boxShadow: 24,
  p: 4
};

type TProps = {
  course: TCourseFull;
  handleRefetchCourses: () => void;
};

const CourseCard: React.FC<TProps> = ({ course, handleRefetchCourses }) => {
  const [userInfo, setUserInfo] = React.useState<IUser | null>(null);
  const [userEmailAction, userEmailResult] = useUserInfoByEmailApiMutation();
  const [addUserIntoCourseAction, addUserIntoCourseResult] = useAddUserIntoCourseApiMutation();
  const [changeStatusCourseAction, changeStatusCourseResult] = useChangeStatusCourseApiMutation();
  const router = useRouter();

  const [mailUser, setMailUser] = React.useState<string>('');
  //Modal MUI
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setMailUser('');
    setUserInfo(null);
    setOpen(true);
  };
  const handleClose = () => {
    setMailUser('');
    setUserInfo(null);
    setOpen(false);
  };

  const handleSubmitModalForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!mailUser) {
      toast.error('Email is required');
      return;
    }
    userEmailAction({ email: mailUser })
      .unwrap()
      .then((res) => {
        setUserInfo(res.data);
      });
  };

  const handleAddUserIntoCourse = ({ userId, courseId }: { userId: string; courseId: string }) => {
    addUserIntoCourseAction({ userId, courseId })
      .unwrap()
      .then(() => {
        setOpen(false);
        handleRefetchCourses();
        toast.success('Add user into course successfully');
      })
      .catch((error) => {
        if (isBadRequestError(error) || isUnauthorizedResponseError(error)) {
          toast.error(error.data.message);
        }
      });
  };

  const changeStatusCourse = () => {
    changeStatusCourseAction({ id: course._id })
      .unwrap()
      .then(() => {
        handleRefetchCourses();
        toast.success(`Change status course successfully`);
      })
      .catch((error) => {
        if (isBadRequestError(error) || isUnauthorizedResponseError(error)) {
          toast.error(error.data.message);
        }
      });
  };

  return (
    <>
      <Card
        sx={{ overflow: 'hidden', background: 'transparent', border: '1px solid #cccccc43' }}
        className="!shadow-2xl dark:!shadow-lg"
      >
        <motion.div whileHover={{ scale: 1.1 }} style={{ overflow: 'hidden' }}>
          <CardMedia component="img" height="140" image={course.thumbnail.url} alt="green iguana" />
        </motion.div>
        <CardContent className="mt-8">
          <Typography gutterBottom variant="h5" component="div" className="dark:text-white text-black !font-Poppins">
            {course.name}
          </Typography>
          <div className="flex items-center gap-4 text-black dark:text-white mt-2">
            <div className="text-xl font-bold">{course.estimatedPrice} $</div>
            <div className="text-base  line-through">{course.price} $</div>
          </div>
          <div className="my-5 flex items-center justify-between">
            <Rating rating={course.rating} />
            <div className="dark:text-[#a3a3a3] text-[#737373] text-base">{course.purchased} students</div>
          </div>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary' }}
            className="dark:text-[#a3a3a3] text-[#737373] line-clamp-5"
          >
            {course.description}
          </Typography>
          <div className="flex items-center justify-between mt-5">
            <button type="button" className="flex outline-none items-center gap-2 " onClick={handleOpen}>
              <IoMdAddCircleOutline size={20} className="text-black dark:text-white" />
              <span className="text-black dark:text-white">Add User</span>
            </button>
            <div className="flex items-center justify-end ">
              <button
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                onClick={() => router.push(`/admin/edit-course/${course._id}`)}
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                  Edit
                </span>
              </button>
              <button
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
                onClick={changeStatusCourse}
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                  {course.isActive ? 'Deactivate' : 'Activate'}
                </span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className="bg-white dark:bg-[#151b29] dark:border-[#cccccc43] border border-solid text-black dark:text-white"
        >
          <form onSubmit={handleSubmitModalForm}>
            <div>
              <label htmlFor="UserMail">Email</label>
              <input
                type="email"
                id="UserMail"
                className="bg-gray-50 border mt-3 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter Email"
                onChange={(e) => setMailUser(e.target.value)}
                onFocus={() => {
                  setUserInfo(null);
                }}
                value={mailUser}
              />
            </div>
            {userInfo && (
              <div className="flex items-center gap-2 mt-5">
                <Avatar>
                  <Image src={userInfo.avatar?.url || userAvatarDefault} alt={userInfo.name} width={300} height={300} />
                </Avatar>
                <div>
                  <Typography variant="h5" className="dark:text-white text-black">
                    {userInfo.name}
                  </Typography>
                  <Typography variant="body2" className="dark:text-[#a3a3a3] text-[#737373]">
                    {userInfo.email}
                  </Typography>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-5">
              {!userInfo ? (
                <button
                  type="submit"
                  className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                  disabled={userEmailResult.isLoading}
                >
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                    Search
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                  onClick={() => handleAddUserIntoCourse({ userId: userInfo._id, courseId: course._id })}
                >
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                    Add
                  </span>
                </button>
              )}
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default CourseCard;
